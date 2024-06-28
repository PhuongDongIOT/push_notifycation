import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'

import { ArticlesService } from './articles.service'
import { ArticlesController } from './articles.controller'
import { ArticleCreatedListener } from './articles.listener'

@Module({
  imports: [
    CacheModule.register()
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticleCreatedListener],
})
export class ArticlesModule { }
