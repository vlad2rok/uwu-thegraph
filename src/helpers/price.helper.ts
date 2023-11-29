import { BigInt } from "@graphprotocol/graph-ts";
import {} from "./fee-destribution.helper";
import { EventFrom } from "../enums";
import { getPriceGetterContract } from "./contract-getter.helper";

export function getUwuPrice(): BigInt {
  const priceGetterContract = getPriceGetterContract();

  const _response = priceGetterContract.try_getPrice();

  if (!_response.reverted) {
    return _response.value;
  } else {
    return BigInt.zero();
  }
}
