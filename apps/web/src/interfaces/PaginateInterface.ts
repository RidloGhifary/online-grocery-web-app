export interface PaginateInterface {
  pageNumber ?: number,
  limitNumber ?: number,
  totalData : number
}

export interface PaginationInterface {
  current_page ?: number,
  next ?: number|null,
  back ?: number|null,
  total_page ?: number
}