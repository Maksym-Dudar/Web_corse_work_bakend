import { Sorts } from "../enums/sorts.enum";

export function mapSortToPrisma(sort: Sorts) {
  switch (sort) {
    case Sorts.highPrice:
      return { price: "desc" as const };
    case Sorts.lowPrice:
      return { price: "asc" as const };
    case Sorts.topRated:
      return { rating: "desc" as const };
    case Sorts.newest:
      return { createdAt: "desc" as const };
    default:
      return { rating: "desc" as const };
  }
}
