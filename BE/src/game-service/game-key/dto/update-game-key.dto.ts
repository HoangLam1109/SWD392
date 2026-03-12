import { PartialType } from '@nestjs/mapped-types';
import { CreateGameKeyDto } from './create-game-key.dto';

export class UpdateGameKeyDto extends PartialType(CreateGameKeyDto) {}
