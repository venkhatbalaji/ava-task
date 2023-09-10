// user.dto.ts
export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  // Add other user properties as needed
}

export class UpdateUserDto {
  readonly username?: string;
  readonly email?: string;
  // Add other user properties as needed
}
