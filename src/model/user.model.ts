export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export class UserResponse {
  username: string;
  name: string;
  email: string;
  token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserProfileRequest {
  name?: string;
  email?: string;
}

export class UpdateUserPasswordRequest {
  old_password: string;
  new_password: string;
}
