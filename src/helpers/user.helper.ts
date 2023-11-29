import { Address } from "@graphprotocol/graph-ts";

export function updateUsers(users: string[], user: string): string[] {
  let isUserAdded = false;
  let result = users;

  for (let i = 0; i < result.length; i++) {
    if (result[i] === user) {
      isUserAdded = true;
    }
  }

  if (!isUserAdded) {
    result.push(user);
  }

  return result;
}
