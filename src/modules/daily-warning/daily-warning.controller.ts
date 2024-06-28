import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Request,
  Body,
  ParseIntPipe,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { DailyWarningService } from './daily-warning.service'
import { DailyWarning } from './daily-warning.entity'
import { CreateDailyWarningDto } from './dto'
import { DailyWarningAdd, IDailyWarningAdd } from './daily-warning.entity'
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

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dailyWarning: CreateDailyWarningDto,
    @Request() request
  ) {
    const userId: number = toNumber(request.userId)
    const dailyWarningIndex: DailyWarningAdd = new IDailyWarningAdd(dailyWarning, userId)
    return this.dailyWarningService.update(id, dailyWarningIndex)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.dailyWarningService.delete(id)
  }
}
