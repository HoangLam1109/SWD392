import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '../enum/profile.enum';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Profile unique identifier',
    example: '1',
  })
  _id: string;

  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  userId: string;

  @ApiProperty({
    description: 'User biography',
    example: 'Software developer',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84912345678',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Home address',
    example: '123 Main St',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Country',
    example: 'Vietnam',
    required: false,
  })
  country?: string;

  @ApiProperty({
    description: 'Social media links',
    example: { facebook: 'https://facebook.com/user' },
    required: false,
  })
  socialLinks?: Record<string, string>;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-01',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Sex',
    enum: Sex,
    required: false,
  })
  sex?: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
