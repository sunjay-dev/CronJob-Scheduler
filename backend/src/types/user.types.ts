export interface LoginParams {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterParams {
  name: string;
  email: string;
  password?: string;
  timezone?: string;
}

export interface VerifyParams {
  userId: string;
  otp: string;
}
