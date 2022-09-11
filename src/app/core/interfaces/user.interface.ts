export interface IUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  favorites?: string[];
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
