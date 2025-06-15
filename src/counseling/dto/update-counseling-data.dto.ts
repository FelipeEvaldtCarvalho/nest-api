import { PartialType } from '@nestjs/mapped-types';
import { CreateCounselingDataDto } from './create-counseling-data.dto';

export class UpdateCounselingDataDto extends PartialType(
  CreateCounselingDataDto,
) {}
