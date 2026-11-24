import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

// Usuário autenticado, como a JwtStrategy coloca em request.user.
export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);
