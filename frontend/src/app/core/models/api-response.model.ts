export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorPayload {
  success: false;
  error: {
    message: string;
    details?: string;
  };
}

export interface HttpErrorState {
  status: number;
  message: string;
}
