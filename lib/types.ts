export type ApiResponse<T = void> = {
  status: "success" | "error";
  message: string;
  data?: T;
};
