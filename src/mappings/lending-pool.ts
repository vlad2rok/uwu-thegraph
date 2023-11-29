import {
  Deposit,
  Withdraw,
  Borrow,
  Repay,
} from "../../generated/LendingPool/LendingPool";
import { setRewardsData } from "../helpers";

export function handleDeposit(event: Deposit): void {
  setRewardsData(event.block.timestamp, event.block.number);
}
export function handleWithdraw(event: Withdraw): void {
  setRewardsData(event.block.timestamp, event.block.number);
}
export function handleBorrow(event: Borrow): void {
  setRewardsData(event.block.timestamp, event.block.number);
}
export function handleRepay(event: Repay): void {
  setRewardsData(event.block.timestamp, event.block.number);
}
