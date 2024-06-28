import { IsString, IsDate,IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDailyWarningDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warningName: string
  
  @ApiProperty()
  @IsInt()
  @IsOptional()
  warningExpired?: number

  @ApiProperty()
  @IsInt()
  @IsOptional()
  warningPreviousExpired?: number

  @ApiProperty()
  @IsInt()
  @IsOptional()
  warningPreviousExpiredNum?: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  warningType?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warningDescription: string
}
