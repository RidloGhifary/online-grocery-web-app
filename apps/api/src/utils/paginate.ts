import { PaginateInterface, PaginationInterface } from "@/interfaces/PaginateInterface";

export function numberization(number:string|any) {
  return typeof number === 'number'? number : Number(number)
}

export default function ({pageNumber=1,limitNumber=20,totalData}:PaginateInterface) : PaginationInterface {
  const safeTotalData = numberization(totalData)
  const safePageNumber = numberization(pageNumber)
  const safeLimitNumber = numberization(limitNumber)
  const totalPages = Math.ceil(safeTotalData / safeLimitNumber);

  return {
    current_page : safePageNumber,
    next : safePageNumber < totalPages ? safePageNumber + 1 : null,
    back : safePageNumber < 1 ? safePageNumber - 1: null,
    total_page : totalPages
  }
}