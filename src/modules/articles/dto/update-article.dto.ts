import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CanBeUndefined } from '../../../utilities/can-be-undefined';

export class UpdateArticleDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
