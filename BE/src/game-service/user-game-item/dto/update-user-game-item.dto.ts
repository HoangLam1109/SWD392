import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGameItemDto } from './create-user-game-item.dto';

export class UpdateUserGameItemDto extends PartialType(CreateUserGameItemDto) {}
