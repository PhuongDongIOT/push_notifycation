import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Request,
  Body,
  ParseIntPipe,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { DailyWarningService } from './daily-warning.service'
import { DailyWarning } from './daily-warning.entity'
import { CreateDailyWarningDto, CreateVehicleDailyWarningDto, ParamDailyWarningDto } from './dto'
import { DailyWarningAdd, IDailyWarningAdd, IParamDailyWarningFilter } from './daily-warning.entity'
import { toNumber } from '@/utilities'


@Controller('daily-warning')
@UseInterceptors(CacheInterceptor)
export class DailyWarningController {
  constructor(private readonly dailyWarningService: DailyWarningService) { }

  @ApiOperation({ summary: 'Get List of All' })
  @ApiOkResponse({
    description: 'The daily warning records',
    type: Array<DailyWarning>,
    isArray: true
  })
  @Get('')
  getAll(@Request() request) {
    const userId: number = toNumber(request.userId)
    return this.dailyWarningService.getAll(userId)
  }

  @Get('/vehicle')
  async getWarningVehicle(@Request() request, @Query() query: any) {
    const { vehicle, search, isCheck } = query
    const paramsFilter:IParamDailyWarningFilter = new IParamDailyWarningFilter(vehicle, search, isCheck)
    const userId: number = toNumber(request.userId)
    return this.dailyWarningService.getWarningVehicle(userId, paramsFilter)
  }

  @Get('/vehicle/:id')
  async getListWarningVehicle(@Param('id', ParseIntPipe) id: number) {
    return this.dailyWarningService.getByListVehicleId(id)
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dailyWarningService.getById(id)
  }

  @Post()
  async create(@Body() dailyWarning: CreateDailyWarningDto, @Request() request) {
    const userId: number = toNumber(request.userId)
    const dailyWarningIndex: DailyWarningAdd = new IDailyWarningAdd(dailyWarning, userId)
    const dailyWarningService = await this.dailyWarningService.create(dailyWarningIndex)
    return dailyWarningService
  }

  @Post('/vehicle')
  async createWarningVehicle(@Body() vehicleDailyWarning: CreateVehicleDailyWarningDto) {
    const dailyWarningService = await this.dailyWarningService.addVehicleDailyWarning(vehicleDailyWarning)
    return dailyWarningService
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dailyWarning: CreateDailyWarningDto,
    @Request() request
  ) {
    console.log('====================================');
    console.log(dailyWarning);
    console.log('====================================');
    const userId: number = toNumber(request.userId)
    const dailyWarningIndex: DailyWarningAdd = new IDailyWarningAdd(dailyWarning, userId)
    return this.dailyWarningService.update(id, dailyWarningIndex)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.dailyWarningService.delete(id)
  }
}
