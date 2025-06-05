import type {
  PageDocProps,
  PaginationProps,
  IPaginationResponse,
} from './types';

/**
 * Pagination Utility function
 */
export const pagination = (data: PaginationProps) => {
  const limit = data?.limit ? Number(data?.limit) : 10;
  const page = data?.page ? Number(data?.page) : 1;
  const skip = limit * (page - 1);

  //
  return { limit, skip, page };
};

/**
 * Calculate pagination including total, next and previous page information
 */
export const getPageDocs = (data: PageDocProps): IPaginationResponse => {
  const page = Math.ceil(data.count / data.limit);

  return {
    total: {
      page,
      limit: data.count,
    },
    next: {
      page: data.page + 1 > page ? null : data.page + 1,
      limit: data.limit,
    },
    prev: {
      page: data.page - 1 <= 0 ? null : data.page - 1,
      limit: data.limit,
    },
  };
};
