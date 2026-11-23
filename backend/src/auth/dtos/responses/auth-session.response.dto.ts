export interface AuthSessionResponse<T> {
  response: T;
  refreshToken: string;
}
