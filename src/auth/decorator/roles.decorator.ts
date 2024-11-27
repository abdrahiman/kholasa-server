import { SetMetadata } from '@nestjs/common';

export enum Role {
  CUSTOMER = 'user',
  ADMIN = 'admin',
}
export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
