import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  RewardData,
  TotalFeeData,
  DailyData,
  RewardTokenPerDay,
} from "../../generated/schema";
import { totalFee } from "../constants/common.constants";

export function loadOrCreateTotalFeeData(timestamp: BigInt): TotalFeeData {
  const id = "total-fee-data";

  let totalFeeData = TotalFeeData.load(id);

  if (totalFeeData == null) {
    totalFeeData = new TotalFeeData(id);
    totalFeeData.currentDay = 0;
    totalFeeData.totalFee = totalFee;
    totalFeeData.timestamp = timestamp;
  }

  return totalFeeData as TotalFeeData;
}

export function loadOrRewardTokenPerDay(
  day: number,
  address: Address
): RewardTokenPerDay {
  const id = `${day}-${address.toHexString()}`;

  let rewardTokenPerDay = RewardTokenPerDay.load(id);

  if (rewardTokenPerDay == null) {
    rewardTokenPerDay = new RewardTokenPerDay(id);
    rewardTokenPerDay.aTokenAddress = address;
  }

  return rewardTokenPerDay as RewardTokenPerDay;
}

export function loadOrCreadeDailyData(day: i32): DailyData {
  const id = `daily-data-${day}`;

  let dailyData = DailyData.load(id);

  if (dailyData == null) {
    dailyData = new DailyData(id);
  }

  return dailyData as DailyData;
}

export function loadOrCreateRewardData(id: Address): RewardData {
  let rewardData = RewardData.load(id.toHexString());

  if (rewardData == null) {
    rewardData = new RewardData(id.toHexString());
  }

  return rewardData as RewardData;
}
