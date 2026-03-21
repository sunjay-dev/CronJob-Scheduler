export interface LoginParams {
  email: string;
  password?: string;
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

export type OAuthUser = {
  _id: { toString(): string };
};
