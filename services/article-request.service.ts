import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    const url = this.makeUrl('article.article', slug);

    return this.http
      .get(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  getArticleByContent(slug: string, language_slug: string): Observable<any> {
    const url = this.makeUrl('article.article.content', `${slug}/${language_slug}`);

    return this.http
      .get(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  getArticles(): Observable<any> {
    return this.http
      .get(this.makeUrl('articles'), this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  getArticlesPaginate(paginate: any): Observable<any> {
    const url = this.makeUrl('article.articles', `?page=${paginate.pageIndex}&per-page=${paginate.pageSize}`);

    return this.http
      .get(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  putArticle(data: any): Observable<any> {
    const url = this.makeUrl('article.article');

    data.category = JSON.stringify(data.category);

    return this.http
      .put(url, JSON.stringify(data), this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  postArticleContent(id: number, data: any): Observable<any> {
    const url = this.makeUrl('article.article.content', `${id}`);

    const formData = new FormData();

    return this.http
      .post(url, JSON.stringify(data), this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  putArticleContent(id: number, data: any): Observable<any> {
    const url = this.makeUrl('article.article.content', `${id}`);

    const formData = new FormData();

    return this.http
      .put(url, JSON.stringify(data), this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  postArticle(id: string, data: any): Observable<any> {
    const url = this.makeUrl('article.article', `${id}`);

    return this.http
      .post(url, JSON.stringify(data), this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  deleteArticle(id: number): Observable<any> {
    const url = this.makeUrl('article.article', `${id}`);

    return this.http
      .delete(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  getTrash(): Observable<any> {
    const url = this.makeUrl('article.trash');

    return this.http
      .get(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  postRestore(id: number): Observable<any> {
    const url = this.makeUrl('article.article.restore', `${id}`);

    return this.http
      .post(url, null, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  deleteForceDelete(id: number): Observable<any> {
    const url = this.makeUrl('article.article.force-delete', `${id}`);

    return this.http
      .delete(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  getPermission(article_id: number): Observable<any> {
    const url = this.makeUrl('article.article.permission', `${article_id}`);

    return this.http
      .get(url, this.options)
      .pipe(catchError(error => this.handleError(error)));
  }

  putPermission(
    article_id: number,
    change_have_permission: Array<any>,
    change_not_have_permission: Array<any>
  ): Observable<any> {
    const url = this.makeUrl('article.permission', `${article_id}`);

    return this.http
      .put(url, JSON.stringify({
        have_permission: change_have_permission,
        not_have_permission: change_not_have_permission
      }), this.options)
      .pipe(catchError(error => this.handleError(error)));
  }
}
