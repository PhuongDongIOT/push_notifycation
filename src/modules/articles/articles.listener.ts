import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ArticleCreatedEvent } from './articles.event';

@Injectable()
export class ArticleCreatedListener {
  @OnEvent('article.created')
  handleOrderCreatedEvent(event: ArticleCreatedEvent) {
    // handle and process "ArticleCreatedEvent" event
    console.log(event);
  }
}