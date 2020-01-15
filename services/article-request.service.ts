import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HelpersService, MainRequestService, RoutingListService } from '../imports';

@Injectable()
export class ArticleRequestService extends MainRequestService {

  constructor(
    http: HttpClient,
    helpersService: HelpersService,
    routingListService: RoutingListService
  ) {
    super(http, helpersService, routingListService);
  }

  getArticle(slug: string): Observable<any> {
    return this.makeGetRequest('article.article', slug);
  }

  getArticleByContent(slug: string, language_slug: string): Observable<any> {
    return this.makeGetRequest('article.content', `${slug}/${language_slug}`);
  }

  getArticles(): Observable<any> {
    return this.makeGetRequest('article.articles');
  }

  getArticlesPaginate(paginate: any): Observable<any> {
    return this.makeGetRequest('article.articles.paginate', `?page=${paginate.pageIndex}&per-page=${paginate.pageSize}`);
  }

  postArticle(data: any): Observable<any> {
    return this.makePostRequest('article.article', data);
  }

  putArticleContent(slug: string, languageSlug: string, data: any): Observable<any> {
    return this.makePutRequest('article.content', data, `${slug}/${languageSlug}`);
  }

  postArticleContent(slug: string, languageSlug: string, data: any): Observable<any> {
    return this.makePostRequest('article.content', data, `${slug}/${languageSlug}`);
  }

  putArticle(id: number, data: any): Observable<any> {
    return this.makePutRequest('article.article', data, `${id}`);
  }

  deleteArticle(id: number): Observable<any> {
    return this.makeDeleteRequest('article.article', `${id}`);
  }

  getTrash(): Observable<any> {
    return this.makeGetRequest('article.articles.trashed.paginate');
  }

  postRestore(id: number): Observable<any> {
    return this.makePostRequest('article.restore', {}, `${id}`);
  }

  deleteForceDelete(id: number): Observable<any> {
    return this.makeDeleteRequest('article.force-delete', `${id}`);
  }

  getPermission(article_id: number): Observable<any> {
    return this.makeGetRequest('article.permission', `${article_id}`);
  }

  putPermission(article_id: number, permissions: any): Observable<any> {
    return this.makePutRequest('article.permission', { permissions: permissions }, `${article_id}`);
  }
}
