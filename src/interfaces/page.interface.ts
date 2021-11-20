export interface Page<T> {
  items: T[];
  number: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
