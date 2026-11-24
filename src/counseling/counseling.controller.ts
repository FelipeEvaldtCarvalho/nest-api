import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../auth/auth-user';
import { CounselingService } from './counseling.service';
import { UpdateCounselingDataDto } from './dto';

// A ficha de aconselhamento é criada junto com o cliente e acessada sempre por ele.
@UseGuards(JwtAuthGuard)
@Controller('counseling')
export class CounselingController {
  constructor(private readonly counselingService: CounselingService) {}

  @Get('customer/:customerId')
  findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.counselingService.findByCustomerId(customerId, user);
  }

  @Patch('customer/:customerId')
  updateByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: UpdateCounselingDataDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.counselingService.updateByCustomerId(customerId, dto, user);
  }
}
