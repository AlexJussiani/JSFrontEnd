export interface Page<T> {
  list: Array<T>;
  totalResults: number;
  pageIndex: number;
  pageSize: number;
  query: any;
}
