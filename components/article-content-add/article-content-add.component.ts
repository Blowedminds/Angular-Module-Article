import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CacheService, ImageSelectComponent } from '../../imports';
import { ArticleRequestService } from '../../services/article-request.service';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleService } from '../../services/article.service';
import { HelpersService } from '../../imports';

declare var tinymce: any;

@Component({
  selector: 'app-article-content-add',
  templateUrl: './article-content-add.component.html',
  styleUrls: ['./article-content-add.component.sass']
})
export class ArticleContentAddComponent implements OnInit, OnDestroy {

  article: any;

  add_languages: any;

  editor: any;

  subs = new Subscription();

  @ViewChild('tiny') set tiny(tiny: any) {
    if (this.add_languages) {

      setTimeout(() => this.runTinymce(), 0);
    }
  }

  get isPageReady() {
    return this.article && this.add_languages;
  }

  constructor(
    public dialog: MatDialog,
    private requestService: ArticleRequestService,
    private service: ArticleService,
    private cacheService: CacheService,
    private helpersService: HelpersService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.route.params.pipe(switchMap((params: Params) => this.requestService.getArticle(params['slug']))
      ).subscribe(response => {

        this.article = response;

        this.subs.add(
          this.cacheService.get('languages', this.requestService.makeGetRequest('admin.languages'))
            .subscribe(languages => {
              this.add_languages = languages;

              for (const content of response.contents) {

                this.add_languages = this.add_languages.filter(language => language.id !== content.language_id);
              }
            })
        );
      })
    );
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);

    this.subs.unsubscribe();
  }

  runTinymce() {
    this.service.initTinymce(
      tinymce,
      this.dialog,
      this.subs,
      ImageSelectComponent,
      this.requestService,
      (editor: any) => { this.editor = editor; });
  }

  addLanguageArticle(f: NgForm) {
    const keywords = [];

    for (const keyw of f.value.keywords.split(',')) {
      if (keyw !== '') {
        keywords.push(keyw);
      }
    }

    this.subs.add(
      this.requestService.putArticleContent(this.article.id, {
        title: f.value.title,
        sub_title: f.value.sub_title,
        body: tinymce.activeEditor.getContent(),
        keywords: keywords,
        published: f.value.published ? 1 : 0,
        language: f.value.language
      }).subscribe((response) => this.helpersService.navigate(['article/content/edit/' + this.article.slug, f.value.language]))
    );
  }
}
