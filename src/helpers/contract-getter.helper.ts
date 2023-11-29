import { FeeDestribution as ControllerFDContract } from "../../generated/FeeDestribution/FeeDestribution";

import { AaveOracle } from "../../generated/FeeDestribution/AaveOracle";
import {
  AAVE_ORACLE_ADDRESS,
  FEE_DESTRIBUTION_ADDRESS,
  POOL_DATA_ADDRESS,
  PRICE_GETTER_ADDRESS,
} from "../constants";
import { LendingPool } from "../../generated/FeeDestribution/LendingPool";

import { PriceGetter as ControllerPGContract } from "../../generated/FeeDestribution/PriceGetter";

export function getLendingPoolContract(): LendingPool {
  return LendingPool.bind(POOL_DATA_ADDRESS);
}

export function getControllerContract(): ControllerFDContract {
  return ControllerFDContract.bind(FEE_DESTRIBUTION_ADDRESS);
}

export function getPriceGetterContract(): ControllerPGContract {
  return ControllerPGContract.bind(PRICE_GETTER_ADDRESS);
}

export function getAaveOracleContract(): AaveOracle {
  return AaveOracle.bind(AAVE_ORACLE_ADDRESS);
}
