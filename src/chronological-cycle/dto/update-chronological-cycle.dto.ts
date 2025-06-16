import { PartialType } from '@nestjs/mapped-types';
import { CreateChronologicalCycleDto } from './create-chronological-cycle.dto';

export class UpdateChronologicalCycleDto extends PartialType(
  CreateChronologicalCycleDto,
) {}
