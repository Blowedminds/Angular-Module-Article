import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CacheService, ImageSelectComponent } from '../../imports';
import { ArticleRequestService } from '../../services/article-request.service';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleService } from '../../services/article.service';

declare var tinymce: any;

@Component({
  selector: 'app-article-content-add',
  templateUrl: './article-content-add.component.html',
  styleUrls: ['./article-content-add.component.sass']
})
export class ArticleContentAddComponent implements OnInit, OnDestroy {

  article: any;

  add_languages: any;

  keywords: Array<string> = [];

  editor: any;

  separatorKeysCodes = [ENTER, COMMA];

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
    tinymce.init({
      height: '420px',
      selector: '#tinymce-textarea',
      plugins: ['link', 'paste', 'table', 'image'],
      skin_url: '/assets/skins/oxide',
      toolbar: 'image myitem',
      setup: editor => {

        editor.ui.registry.addButton('myitem', {
          text: 'Resim Ekle',
          onAction: (_) => {

            this.subs.add(
              this.service.insertImageIntoEditor(this.dialog, ImageSelectComponent, {
                image_request: this.requestService.makeGetRequest('image.images'),
                thumb_image_url: this.requestService.makeUrl('storage.images')
              }).subscribe(response =>
                editor.insertContent(
                  `<img src="${response.thumb_url}" alt="${response.alt}" width="${response.width}" height="${response.height}" />`
                )
              )
            );
          }
        });

        this.editor = editor;
      },
    });
  }

  addLanguageArticle(f: NgForm) {
    this.subs.add(
      this.requestService.putArticleContent(this.article.id, {
        title: f.value.title,
        sub_title: f.value.sub_title,
        body: tinymce.activeEditor.getContent(),
        keywords: this.keywords,
        published: f.value.published ? 1 : 0,
        language_id: f.value.language_id
      }).subscribe((response) => alert('success'))
    );
  }
}
