import { Address, log } from "@graphprotocol/graph-ts";
import { LendingPool, PoolCurrency } from "../../generated/schema";
import {
  LendingPool__getReservesDataResultValue0Struct,
  LendingPool__getReservesDataResultValue1Struct,
} from "../../generated/Controller/LendingPool";

export function loadOrCreateLendingPool(id: Address): LendingPool {
  let lending = LendingPool.load(id.toHexString());

  if (lending == null) {
    lending = new LendingPool(id.toHexString());
  }

  return lending as LendingPool;
}

export function loadOrCreatePoolCurrency(): PoolCurrency {
  let poolCurrency = PoolCurrency.load("pool-currency");

  if (poolCurrency == null) {
    poolCurrency = new PoolCurrency("pool-currency");
  }

  return poolCurrency as PoolCurrency;
}

export function updateLendingPool(
  reserves: LendingPool__getReservesDataResultValue0Struct[],
  poolBaseCurrency: LendingPool__getReservesDataResultValue1Struct,
  poolAddress: Address
): void {
  for (let i = 0; i < reserves.length; i++) {
    const reserve = reserves[i];

    if (reserve.aTokenAddress == poolAddress) {
      const pool = loadOrCreateLendingPool(reserve.underlyingAsset);

      pool.name = reserve.name;
      pool.symbol = reserve.symbol;
      pool.decimals = reserve.decimals;
      pool.baseLTVasCollateral = reserve.baseLTVasCollateral;
      pool.reserveLiquidationThreshold = reserve.reserveLiquidationThreshold;
      pool.reserveLiquidationBonus = reserve.reserveLiquidationBonus;
      pool.reserveFactor = reserve.reserveFactor;
      pool.usageAsCollateralEnabled = reserve.usageAsCollateralEnabled;
      pool.borrowingEnabled = reserve.borrowingEnabled;
      pool.stableBorrowRateEnabled = reserve.stableBorrowRateEnabled;
      pool.isActive = reserve.isActive;
      pool.isFrozen = reserve.isFrozen;
      pool.liquidityIndex = reserve.liquidityIndex;
      pool.variableBorrowIndex = reserve.variableBorrowIndex;
      pool.liquidityRate = reserve.liquidityRate;
      pool.variableBorrowRate = reserve.variableBorrowRate;
      pool.stableBorrowRate = reserve.stableBorrowRate;
      pool.lastUpdateTimestamp = reserve.lastUpdateTimestamp;
      pool.aTokenAddress = reserve.aTokenAddress;
      pool.stableDebtTokenAddress = reserve.stableDebtTokenAddress;
      pool.variableDebtTokenAddress = reserve.variableDebtTokenAddress;
      pool.interestRateStrategyAddress = reserve.interestRateStrategyAddress;
      pool.availableLiquidity = reserve.availableLiquidity;
      pool.totalPrincipalStableDebt = reserve.totalPrincipalStableDebt;
      pool.averageStableRate = reserve.averageStableRate;
      pool.stableDebtLastUpdateTimestamp =
        reserve.stableDebtLastUpdateTimestamp;
      pool.totalScaledVariableDebt = reserve.totalScaledVariableDebt;
      pool.priceInMarketReferenceCurrency =
        reserve.priceInMarketReferenceCurrency;
      pool.variableRateSlope1 = reserve.variableRateSlope1;
      pool.variableRateSlope2 = reserve.variableRateSlope2;
      pool.stableRateSlope1 = reserve.stableRateSlope1;
      pool.stableRateSlope2 = reserve.stableRateSlope2;
      pool.save();
    }
  }

  const poolCurrency = loadOrCreatePoolCurrency();

  poolCurrency.marketReferenceCurrencyDecimals =
    poolBaseCurrency.marketReferenceCurrencyUnit;
  poolCurrency.marketReferenceCurrencyPriceInUsd =
    poolBaseCurrency.marketReferenceCurrencyPriceInUsd;
  poolCurrency.networkBaseTokenPriceInUsd =
    poolBaseCurrency.networkBaseTokenPriceInUsd;
  poolCurrency.networkBaseTokenPriceDecimals =
    poolBaseCurrency.networkBaseTokenPriceDecimals;

  poolCurrency.save();
}
