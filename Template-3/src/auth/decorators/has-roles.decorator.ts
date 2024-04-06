import { SetMetadata } from '@nestjs/common';
import { Role } from '../model/role.enum';

export const HasRoles = (...role: Role[]) => SetMetadata('roles', role);
