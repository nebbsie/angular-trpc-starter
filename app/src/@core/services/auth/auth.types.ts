export type AuthErrorResponse = {
  success: false;
  code: string;
};

export type AuthSuccessResponse = {
  success: true;
};

export type AuthResponse = AuthErrorResponse | AuthSuccessResponse;
