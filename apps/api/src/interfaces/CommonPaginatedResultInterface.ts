import { PaginationInterface } from "./PaginateInterface";

/**
 * A common interface for paginate API responses.
 * 
 * @template T - The type of data to be returned. 
 */
export default interface CommonPaginatedResultInterface<T> {
  [x: string]: any;
  /**
   * Indicates whether the operation was successful.
   */
  ok: boolean;

  /**
   * The main data returned by the API.
   * 
   * @type {T}
   * @description Provide the data using the appropriate constructor.
   */
  data: {data :T|null, pagination : PaginationInterface|null};

  /**
   * A message providing additional information about the operation.
   */
  message?: string;

  /**
   * Any error information if the operation failed.
   */
  error?: string | any;
}
