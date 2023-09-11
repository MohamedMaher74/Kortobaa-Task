export interface SignUpType {
  fullname: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface forgetPassword {
  email: string;
}

export interface verifyResetCode {
  resetCode: string;
}

export interface resetPassword {
  id: any;
  password: string;
}
