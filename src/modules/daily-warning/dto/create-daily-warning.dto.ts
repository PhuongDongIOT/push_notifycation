import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDailyWarningDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warningName: string

  @ApiProperty()
  @IsOptional()
  warningExpired?: number | null

  @ApiProperty()
  @IsOptional()
  warningPreviousExpired?: number | null

  @ApiProperty()
  @IsOptional()
  warningPreviousExpiredNum?: number | string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  warningType?: string | null

  @ApiProperty()
  @IsInt()
  @IsOptional()
  warningLevel?: number | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  warningDescription?: string | null

  @ApiProperty()
  @IsOptional()
  warningExpiredKm?: number | string | null

  @ApiProperty()
  @IsOptional()
  warningPreviousExpiredNumKm?: number | string | null

  @ApiProperty()
  @IsOptional()
  warningAlert?: number | string | null

  @ApiProperty()
  @IsOptional()
  isChecked?: boolean | number

  @ApiProperty()
  @IsOptional()
  vehicles?: any
}

export class ParamDailyWarningDto {

  @ApiProperty()
  @IsString()
  vehicle?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string | null
}
