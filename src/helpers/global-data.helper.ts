// import { GlobalData } from "../../generated/schema";
import {
  LendingPool__getReservesDataResultValue0Struct,
  LendingPool__getReservesDataResultValue1Struct,
} from "../../generated/Controller/LendingPool";

// export function loadOrCreateGlobalData(): GlobalData {
//   let data = GlobalData.load("globalData");

//   if (data == null) {
//     data = new GlobalData("globalData");

//     data.totalLockedInUsd = 0;
//   }

//   return data as GlobalData;
// }

export function getTotalLockedInUsd(
  reserves: LendingPool__getReservesDataResultValue0Struct[],
  poolBaseCurrencyRaw: LendingPool__getReservesDataResultValue1Struct
): number {
  let totalLockedInUsd: number = 0;

  // for (let i = 0; i < reserves.length; i++) {
  //   const reserve = reserves[i];

  //   totalLockedInUsd = totalLockedInUsd.plus(
  //     valueToBigNumber(reserve.totalLiquidity)
  //       .multipliedBy(reserve.priceInMarketReferenceCurrency)
  //       .multipliedBy(marketRefPriceInUsd)
  //   );
  // }

  return totalLockedInUsd;
}
