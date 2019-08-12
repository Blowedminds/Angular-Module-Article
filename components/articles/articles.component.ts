import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs';
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

  subs = new Subscription();

  get isPageReady(): boolean {
    return this.articles && this.languages;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: ArticleService,
    private requestService: ArticleRequestService,
    private cacheService: CacheService,
    private helpersService: HelpersService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.activatedRoute.queryParams.pipe(
        switchMap((params: Params) => {
          this.articles = null;

          return this.requestService.getArticlesPaginate({
            pageSize: +params['page-size'] || this.service.defaultPageSize,
            pageIndex: +params['page'] || 0
          });
        })
      ).subscribe(articles => this.articles = articles)
    );

    this.subs.add(
      this.cacheService.get('languages', this.requestService.makeGetRequest('core.language.languages'))
        .subscribe(response => this.languages = response)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
