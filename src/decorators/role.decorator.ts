import { SetMetadata } from '@nestjs/common';
import { EUserRole } from 'src/shared/common.constants';

export const ROLES_KEY = 'roles';
export const Roles = (roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
