export interface GenericRepsone<T> {
  status: "success" | "failed";
  data?: T | Record<string, T>;
  error?: T;
}
