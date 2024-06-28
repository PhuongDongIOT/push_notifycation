import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
// import { CanBeUndefined } from '../../../utilities/can-be-undefined'

export class UpdateDailyWarningDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warningName: string
  
  @ApiProperty()
  @IsDate()
  @IsOptional()
  warningExpired?: Date

  @ApiProperty()
  @IsDate()
  @IsOptional()
  warningPreviousExpired?: Date

  @ApiProperty()
  @IsDate()
  @IsOptional()
  warningType?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warningDescription: string
}
