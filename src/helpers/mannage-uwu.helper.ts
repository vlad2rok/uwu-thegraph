import {
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "../constants/common.constants";

export function getDaySeconds(): i64 {
  const secondsInDay = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;

  return secondsInDay;
}
