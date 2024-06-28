import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eq } from 'drizzle-orm';

import { DrizzleService } from '../../core/database/drizzle.service';
import { databaseSchema } from '../../core/database/databaseSchema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleCreatedEvent } from './articles.event';

@Injectable()
export class ArticlesService implements OnModuleInit {

  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
  
  constructor(private readonly drizzleService: DrizzleService,
     private eventEmitter: EventEmitter2) {}

  getAll() {
    return this.drizzleService.db.select().from(databaseSchema.articles);
  }

  async getById(id: number) {
    const articles = await this.drizzleService.db
      .select()
      .from(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id));
    const article = articles.pop();
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }

  async create(article: CreateArticleDto) {
    const createdArticles = await this.drizzleService.db
      .insert(databaseSchema.articles)
      .values(article)
    
    const articleCreatedEvent = new ArticleCreatedEvent();
    articleCreatedEvent.title = article.title;
    articleCreatedEvent.content = article.content;
    this.eventEmitter.emit('article.created', articleCreatedEvent);

    return createdArticles.pop();
  }

  async update(id: number, article: UpdateArticleDto) {
    const updatedArticles = await this.drizzleService.db
      .update(databaseSchema.articles)
      .set(article)
      .where(eq(databaseSchema.articles.id, id))

    if (updatedArticles[1].length === 0) {
      throw new NotFoundException();
    }

    return updatedArticles.pop();
  }

  async delete(id: number) {
    const deletedArticles = await this.drizzleService.db
      .delete(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id))
      
    if (deletedArticles[1].length === 0) {
      throw new NotFoundException();
    }
  }
}
