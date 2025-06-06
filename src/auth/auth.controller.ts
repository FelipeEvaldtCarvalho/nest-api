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
import { CreateDto } from './dto/create.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('create')
  async create(@Body() createDto: CreateDto) {
    const token = await this.authService.createUser(createDto);
    if (!token) {
      throw new UnauthorizedException('User creation failed');
    }
    return token;
  }

  @Get('verify-token')
  async verifyToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token não informado');
    }
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.verifyToken(token);

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    delete user.password;
    delete user.isActive;

    return user;
  }
}
