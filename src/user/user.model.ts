export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export class UserResponse {
  username: string;
  name: string;
  token?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export class LoginUserRequest {
  // usernameOrEmail: string;
  username: string;
  password: string;
}

export class UpdateUserProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export class UpdateUserPasswordRequest {
  old_password: string;
  new_password: string;
}
