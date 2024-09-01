/**
 * A common interface for API responses.
 * 
 * @template T - The type of data to be returned. 
 */
export default interface CommonResultInterface<T> {
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
  data?: T;

  /**
   * A message providing additional information about the operation.
   */
  message?: string;

  /**
   * Any error information if the operation failed.
   */
  error?: string | any;
}
