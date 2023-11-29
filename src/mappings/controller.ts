import { log } from "@graphprotocol/graph-ts";
import {
  BalanceUpdated,
  OwnershipTransferred,
} from "../../generated/Controller/Controller";
import { LendingPool } from "../../generated/Controller/LendingPool";
import { LENDING_POOL_ADDRESS, POOL_DATA_ADDRESS } from "../constants";
import { loadOrCreateToken, updateLendingPool } from "../helpers";

export function handleBalanceUpdated(event: BalanceUpdated): void {
  const token = loadOrCreateToken(event.params.token);

  const contract = LendingPool.bind(POOL_DATA_ADDRESS);
  const _reservesResponse = contract.try_getReservesData(LENDING_POOL_ADDRESS);

  if (!_reservesResponse.reverted) {
    const reserves = _reservesResponse.value.value0;
    const poolBaseCurrency = _reservesResponse.value.value1;

    updateLendingPool(reserves, poolBaseCurrency, event.params.token);
  }

  token.totalSupply = event.params.totalSupply;
  token.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
