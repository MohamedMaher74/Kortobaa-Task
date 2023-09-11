export interface CreateUser {
  fullname: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUser {
  role?: string;
  fullname?: string;
}

export interface UpdateLoggedUserPassword {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateLoggedUserData {
  fullname?: string;
}
