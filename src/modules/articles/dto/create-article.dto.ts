import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
