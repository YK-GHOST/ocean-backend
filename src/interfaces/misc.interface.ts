export interface GenericRepsone<T> {
  success: boolean;
  data?: T | Record<string, T>;
  error?: T;
}
