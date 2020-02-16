import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CacheService, ImageSelectComponent } from '../../imports';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';

import { Subscription, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare var tinymce: any;

@Component({
  selector: 'app-article-content-edit',
  templateUrl: './article-content-edit.component.html',
  styleUrls: ['./article-content-edit.component.sass']
})
export class ArticleContentEditComponent implements OnInit, OnDestroy {

  article: any;

  language: any;

  editor: any;

  subs = new Subscription();

  keywords = '';

  @ViewChild('tiny') set tiny(tiny: any) {
    if (this.article) {

      setTimeout(() => this.runTinymce(), 0);
    }
  }

  get isPageReady() {
    return this.article && this.language;
  }

  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private requestService: ArticleRequestService,
    private service: ArticleService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.subs.add(
      this.route.params.pipe(
        switchMap((params: Params) =>
          params['slug'] && params['language_slug'] ?
            this.requestService.getArticleByContent(params['slug'], params['language_slug']) :
            throwError({})
        ))
        .subscribe((response: any) => {

          this.article = response;

          this.subs.add(
            this.cacheService.get('languages', this.requestService.makeGetRequest('core.language.languages'))
              .subscribe(languages => {
                this.language = languages.find(language => language.id === response.content.language_id);
              })
          );
        })
    );

  }

  runTinymce() {
    this.service.initTinymce(
      tinymce,
      this.dialog,
      this.subs,
      ImageSelectComponent,
      this.requestService,
      (editor: any) => { this.editor = editor; });

    tinymce.activeEditor.setContent(this.article.content.body);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);

    this.subs.unsubscribe();
  }

  editArticle(f: NgForm) {
    for (const keyw of f.value.keywords.split(',')) {
      if (keyw !== '') {
        this.article.content.keywords.push(keyw);
      }
    }

    const rq2 = this.requestService.putArticleContent(this.article.slug, this.language.slug, {
      title: f.value.title,
      sub_title: f.value.sub_title,
      body: tinymce.activeEditor.getContent(),
      keywords: this.article.content.keywords,
      published: f.value.published ? 1 : 0
    }).subscribe(response => {
      this.snackBar.open(response.message, response.action, { duration: 2000 });
      this.keywords = '';
    });

    this.subs.add(rq2);
  }

  removeKeyword(index: number): void {
    this.article.content.keywords.splice(index, 1);
  }
}
