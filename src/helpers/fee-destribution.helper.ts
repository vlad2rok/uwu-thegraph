import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  RewardData,
  TotalFeeData,
  DailyData,
  RewardTokenPerDay,
} from "../../generated/schema";
import {
  FeeDestribution as ControllerFDContract,
  FeeDestribution__rewardDataResult,
} from "../../generated/FeeDestribution/FeeDestribution";

import {
  FEE_DESTRIBUTION_ADDRESS,
  LENDING_POOL_ADDRESS,
  UWU_TOKEN_ADDRESS,
} from "../constants";
import { LendingPool__getReservesDataResultValue0Struct } from "../../generated/FeeDestribution/LendingPool";
import { RewardAndUnderlying } from "../types";
import { RewardAndUnderlyingTokens } from "../enums";
import { getUwuPrice } from "./price.helper";
import { startBlock } from "../constants/common.constants";
import { getDaySeconds } from "./mannage-uwu.helper";
import {
  getAaveOracleContract,
  getControllerContract,
  getLendingPoolContract,
} from "./contract-getter.helper";
import {
  loadOrCreadeDailyData,
  loadOrCreateRewardData,
  loadOrCreateTotalFeeData,
  loadOrRewardTokenPerDay,
} from "./controller.helper";

export function isNewDayStarted(
  lastDay_timestamp: BigInt,
  timestamp: BigInt
): boolean {
  const day = BigInt.fromI64(getDaySeconds());

  return timestamp.minus(lastDay_timestamp).ge(day);
}

export function setRewardsData(timestamp: BigInt, blockNumber: BigInt): void {
  const uwuPrice = getUwuPrice();

  const rewardTokens = getRewardTokens();
  const lendingPoolContract = getLendingPoolContract();
  const _reservesResponse =
    lendingPoolContract.try_getReservesData(LENDING_POOL_ADDRESS);

  const totalFeeData = loadOrCreateTotalFeeData(timestamp);

  const isCanCountPerDay =
    isNewDayStarted(totalFeeData.timestamp, timestamp) &&
    blockNumber.gt(startBlock);

  if (!_reservesResponse.reverted) {
    const reserves = _reservesResponse.value.value0;
    const rewardAndUnderlying = getUnderlyingAssetsByAddresses(
      rewardTokens,
      reserves
    );
    const assetsPrices = getAssetsPrice(rewardAndUnderlying);

    if (assetsPrices != null) {
      for (let i = 0; i < rewardAndUnderlying.length; i++) {
        const _rewardData = getRewardData(rewardAndUnderlying[i]);
        if (_rewardData) {
          const underlyingAsset =
            rewardAndUnderlying[i][RewardAndUnderlyingTokens.Underlying];
          const aTokenAddress =
            rewardAndUnderlying[i][RewardAndUnderlyingTokens.Reward];

          const rewardData = loadOrCreateRewardData(aTokenAddress);
          const isUwu = underlyingAsset.equals(UWU_TOKEN_ADDRESS);
          const price = isUwu ? uwuPrice : assetsPrices[i];

          if (isCanCountPerDay) {
            const rewardPerDay = loadOrRewardTokenPerDay(
              totalFeeData.currentDay,
              aTokenAddress
            );

            rewardPerDay.underlyingAsset = underlyingAsset;
            rewardPerDay.rate = _rewardData.value1;
            rewardPerDay.price = price;
            rewardPerDay.day = `daily-data-${totalFeeData.currentDay}`;

            rewardPerDay.save();
          }

          rewardData.underlyingAsset = underlyingAsset;
          rewardData.periodFinish = _rewardData.value0;
          rewardData.rewardRate = _rewardData.value1;
          rewardData.lastUpdateTime = _rewardData.value2;
          rewardData.rewardPerTokenStored = _rewardData.value3;
          rewardData.balance = _rewardData.value4;
          rewardData.price = price;
          rewardData.save();
        }
      }
      if (isCanCountPerDay) {
        totalFeeData.timestamp = timestamp;
        const newDay = loadOrCreadeDailyData(totalFeeData.currentDay);
        newDay.save();

        totalFeeData.currentDay = totalFeeData.currentDay + 1;
      }
    }
  }

  if (blockNumber.gt(startBlock)) {
    totalFeeData.save();
  }
}

export function getRewardTokens(): Address[] {
  const contract = getControllerContract();
  const rewardTokens: Address[] = [];

  let counter: BigInt = BigInt.zero();
  let isValidResponse: boolean = true;

  while (isValidResponse) {
    const _rewardAddress = contract.try_rewardTokens(counter);

    if (!_rewardAddress.reverted) {
      rewardTokens.push(_rewardAddress.value);
      counter = counter.plus(BigInt.fromI32(1));
    } else {
      isValidResponse = false;

      break;
    }
  }

  return rewardTokens;
}

export function getAssetsPrice(
  rewardAndUnderlying: RewardAndUnderlying[]
): BigInt[] | null {
  const contract = getAaveOracleContract();
  const underlyingAssets: Address[] = [];

  for (let i = 0; i < rewardAndUnderlying.length; i++) {
    underlyingAssets.push(
      rewardAndUnderlying[i][RewardAndUnderlyingTokens.Underlying]
    );
  }
  const _prices = contract.try_getAssetsPrices(underlyingAssets);

  if (!_prices.reverted) {
    return _prices.value;
  } else {
    return null;
  }
}

export function getUnderlyingAssetsByAddresses(
  addresses: Address[],
  reserves: LendingPool__getReservesDataResultValue0Struct[]
): RewardAndUnderlying[] {
  const result: RewardAndUnderlying[] = [];

  for (let i = 0; i < addresses.length; i++) {
    let reserve: LendingPool__getReservesDataResultValue0Struct | null = null;

    for (let j = 0; j < reserves.length; j++) {
      if (reserves[j].aTokenAddress.equals(addresses[i])) {
        reserve = reserves[j];
      }
    }

    if (reserve) {
      if (reserve.underlyingAsset) {
        result.push([addresses[i], reserve.underlyingAsset]);
      }
    } else {
      result.push([addresses[i], UWU_TOKEN_ADDRESS]);
    }
  }

  return result;
}

export function getRewardData(
  rewardAndUnderlying: RewardAndUnderlying
): FeeDestribution__rewardDataResult | null {
  const contract = ControllerFDContract.bind(FEE_DESTRIBUTION_ADDRESS);

  const _rewardData = contract.try_rewardData(
    rewardAndUnderlying[RewardAndUnderlyingTokens.Reward]
  );

  if (!_rewardData.reverted) {
    return _rewardData.value;
  } else {
    return null;
  }
}
