import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Headers,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Controller('articles')
@UseInterceptors(CacheInterceptor)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get('/token')
  getToken(@Headers() headers) {
    return null
  }

  @ApiOperation({ summary: 'Get List of All' })
  @Get()
  getAll() {
    return this.articlesService.getAll()
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.getById(id)
  }

  @Post()
  create(@Body() article: CreateArticleDto) {
    return this.articlesService.create(article)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() article: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, article)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.articlesService.delete(id)
  }
}
