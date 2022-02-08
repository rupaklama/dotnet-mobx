export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// helper class to get access to pagination data inside the response header
// reusable paginated class for any data types
export class PaginatedResult<T> {
  forEach(arg0: (activity: import("./activity").Activity) => void) {
    throw new Error("Method not implemented.");
  }
  data: T;
  pagination: Pagination;

  constructor(data: T, pagination: Pagination) {
    this.data = data;
    this.pagination = pagination;
  }
}

// paging params for api call
export class PagingParams {
  pageNumber;
  pageSize; // items

  constructor(pageNumber = 1, pageSize = 2) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}
