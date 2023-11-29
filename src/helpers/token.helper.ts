import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Token } from "../../generated/schema";

export function loadOrCreateToken(id: Address): Token {
  let token = Token.load(id.toHexString());

  if (token == null) {
    token = new Token(id.toHexString());

    token.totalSupply = BigInt.zero();
  }

  return token as Token;
}
