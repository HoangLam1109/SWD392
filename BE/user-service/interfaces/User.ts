export enum UserAccountType {
  PLAYER = 'player',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: UserAccountType;
  primaryPhone: string;
  secondaryPhone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UserCreateAttributes = PartialBy<
  UserAttributes,
  'id' | 'firstName' | 'lastName' | 'primaryPhone' | 'secondaryPhone' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
