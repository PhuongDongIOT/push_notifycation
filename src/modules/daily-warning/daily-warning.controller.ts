import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Controller,
  Get,
  Options,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Request,
  Body,
  ParseIntPipe,
  UseInterceptors,
  StreamableFile
} from '@nestjs/common'
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { DailyWarningService } from './daily-warning.service'
import { DailyWarning } from './daily-warning.entity'
import { CreateDailyWarningDto, CreateVehicleDailyWarningDto, PutSwitchDailyWarningDto, DeletedDailyWarningDto } from './dto'
import { DailyWarningAdd, IDailyWarningAdd, IParamDailyWarningFilter } from './daily-warning.entity'
import { toNumber } from '@/utilities'
import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from '@blazity/nest-file-fastify'
import { createReadStream, ReadStream } from 'fs'
import * as xlsx from 'xlsx';
import { WorkSheet } from 'xlsx';
import { join } from 'path'


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

  @Options('')
  getIAll(@Request() request) {
    const userId: number = toNumber(request.userId)
    return this.dailyWarningService.getAll(userId)
  }

  @Get('/vehicle')
  async getWarningVehicle(@Request() request, @Query() query: any) {
    const { vehicle, search, isCheck } = query
    const paramsFilter: IParamDailyWarningFilter = new IParamDailyWarningFilter(vehicle, search, isCheck)
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
    const userId: number = toNumber(request.userId)
    const dailyWarningIndex: DailyWarningAdd = new IDailyWarningAdd(dailyWarning, userId)
    return this.dailyWarningService.update(id, dailyWarningIndex)
  }

  @Put('/switch')
  updateSwitch(
    @Body() switchDailyWarningDto: PutSwitchDailyWarningDto
  ) {
    return this.dailyWarningService.updateSwitch(switchDailyWarningDto)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Body() deletedDailyWarningDto: DeletedDailyWarningDto) {
    const { listDeleted } = deletedDailyWarningDto
    const responseDeleteWarning = await this.dailyWarningService.delete(id, listDeleted)
    return responseDeleteWarning
  }

  @Get('file')
  getFile(@Query() query: any): StreamableFile {
    const { nameFile } = query
    if (!nameFile) return null
    const file = createReadStream(join(process.cwd(), 'public/', nameFile));
    return new StreamableFile(file, {
      type: 'blob',
      disposition: `attachment; filename=${nameFile}`,
    });
  }

  @Post('import-data-excel')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileExcel' }
    ])
  )
  async register(
    @Body() data: Record<string, unknown>,
    @Request() request,
    @UploadedFiles()
    files: { fileExcel?: MemoryStorageFile }
  ): Promise<any> {
    const userId: number = toNumber(request.userId)
    if (files.fileExcel) {
      const wb: any = await new Promise((resolve, reject) => {
        const stream: ReadStream = files.fileExcel[0].buffer;
        resolve(xlsx.read(stream, { type: 'buffer' }));
      })

      const sheet: WorkSheet = wb.Sheets[wb.SheetNames[0]];
      const range: xlsx.Range = xlsx.utils.decode_range(sheet['!ref']);
      return this.dailyWarningService.transationImportDataXcel(userId, sheet, range)
    }
    return null
  }
}
