export interface PaginationProps {
  page?: number;
  limit?: number;
}

export interface PageDocProps {
  page: number;
  limit: number;
  count: number;
}

export interface IPaginationResponse {
  total: {
    page: number;
    limit: number;
  };
  next: {
    page: number | null;
    limit: number;
  };
  prev: {
    page: number | null;
    limit: number;
  };
}
