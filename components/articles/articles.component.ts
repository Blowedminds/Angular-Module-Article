import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CacheService, HelpersService } from '../../imports';
import { ArticleService } from '../../services/article.service';
import { ArticleRequestService } from '../../services/article-request.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.sass']
})
export class ArticlesComponent implements OnInit, OnDestroy {

  articles: any;

  languages: any;

  categories: any;

  user: any;

  subscriptions = new Subscription();

  pageSizeOptions: Array<number> = [5, 10, 20, 50];

  get isPageReady(): boolean {
    return this.articles && this.languages && this.categories && this.user;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private articleRequestService: ArticleRequestService,
    private cacheService: CacheService,
    private helpersService: HelpersService,
  ) { }

  ngOnInit() {

    const rq = this.activatedRoute.queryParams.pipe(
      switchMap((params: Params) => this.getArticlesPaginate({
        pageSize: +params['page-size'] || this.pageSizeOptions[0],
        pageIndex: +params['page'] || 0
      }))
    ).subscribe(articles => this.articles = articles);

    const rq1 = this.cacheService.get('languages', this.articleRequestService.makeGetRequest('admin.languages'))
      .subscribe(response => this.languages = response);

    const rq2 = this.cacheService.get('categories', this.articleRequestService.makeGetRequest('admin.categories'))
      .subscribe(response => this.categories = response);

    const rq3 = this.cacheService.get('user', this.articleRequestService.makeGetRequest('user.info'))
      .subscribe(response => this.user = response);

    // BUG: this line causes the request cancelled
    // this.subscriptions.add(rq1).add(rq2).add(rq3);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getArticlesPaginate(options: { pageSize: number, pageIndex: number }): Observable<any> {
    this.articles = null;

    return this.articleRequestService.getArticlesPaginate({
      pageSize: options.pageSize, pageIndex: options.pageIndex
    });
  }

  intval(value: string) {
    return +value;
  }

  findLanguage(id: number) {
    const lang = this.languages.find(language => language.id === id);

    return lang || { name: 'NullLanguage' };
  }

  changePageOptions(options: { pageSize: number, pageIndex: number }) {
    this.helpersService.navigate(['/articles'], {
      queryParams: {
        'page-size': options.pageSize,
        'page': options.pageIndex + 1
      }
    });
  }
}
