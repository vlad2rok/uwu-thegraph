import {
  ExitedEarly,
  Locked,
  Minted,
  RewardPaid,
  Withdrawn,
  WithdrawnExpiredLocks,
} from "../../generated/FeeDestribution/FeeDestribution";
import { setRewardsData } from "../helpers";

export function handleExitedEarly(event: ExitedEarly): void {
  setRewardsData(event.block.timestamp, event.block.number);
}

export function handleLocked(event: Locked): void {
  setRewardsData(event.block.timestamp, event.block.number);
}

export function handleMinted(event: Minted): void {
  setRewardsData(event.block.timestamp, event.block.number);
}

export function handleWithdrawn(event: Withdrawn): void {
  setRewardsData(event.block.timestamp, event.block.number);
}

export function handleWithdrawnExpiredLocks(
  event: WithdrawnExpiredLocks
): void {
  setRewardsData(event.block.timestamp, event.block.number);
}

export function handleRewardPaid(event: RewardPaid): void {
  setRewardsData(event.block.timestamp, event.block.number);
}
