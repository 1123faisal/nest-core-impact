import { PartialType } from '@nestjs/swagger';
import { CreateHydrationLogDto } from './create-hydration-log.dto';

export class UpdateHydrationLogDto extends PartialType(CreateHydrationLogDto) {}
