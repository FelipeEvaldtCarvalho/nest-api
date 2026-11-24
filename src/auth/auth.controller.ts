import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// Não existe mais cadastro público: operadores são criados pelo admin em POST /users.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }

  @Get('verify-token')
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não informado');
    }
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.verifyToken(token);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Token inválido');
    }

    const { isActive: _, ...result } = user;
    return result;
  }
}
