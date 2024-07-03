import { IsString, IsArray, IsNotEmpty, IsBoolean, IsInt, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateVehicleDailyWarningDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameVehicle: string

  @ApiProperty()
  @IsArray()
  @IsOptional()
  listIdWarning?: Array<number>
}

export class PutSwitchDailyWarningDto {

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVehicle?: boolean

  @ApiProperty()
  @IsString()
  @IsOptional()
  nameVehicle?: string
}
