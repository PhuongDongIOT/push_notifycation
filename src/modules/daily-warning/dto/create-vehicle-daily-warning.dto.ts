import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator'
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

