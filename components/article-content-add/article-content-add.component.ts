import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import * as tinymce from 'tinymce/tinymce';

import { CacheService, ImageSelectComponent } from '../../imports';
import { ArticleService } from '../../services/article.service';
import { ArticleRequestService } from '../../services/article-request.service';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-article-content-add',
  templateUrl: './article-content-add.component.html',
  styleUrls: ['./article-content-add.component.sass']
})
export class ArticleContentAddComponent implements OnInit, OnDestroy {

  article: any;

  add_languages: any;

  keywords: Array<string> = [];

  @Input() elementId = 'tinymce-textarea';

  @Output() editorKeyup = new EventEmitter<any>();

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
    private articleRequestService: ArticleRequestService,
    private cacheService: CacheService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    const rq1 = this.route.params.pipe(switchMap((params: Params) => this.articleRequestService.getArticle(params['slug']))
    ).subscribe(response => {

      this.article = response;

      const rq2 = this.cacheService.get('languages', this.articleRequestService.makeGetRequest('admin.languages'))
        .subscribe(languages => {
          this.add_languages = languages;

          for (const content of response.contents) {

            this.add_languages = this.add_languages.filter(language => language.id !== content.language_id);
          }
        });

      // this.subs.add(rq2)
    });
    this.subs.add(rq1);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);

    this.subs.unsubscribe();
  }

  runTinymce() {
    tinymce.init({
      height: '420px',
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'image'],
      toolbar: 'image',
      skin_url: '/assets/skins/lightgray',
      setup: editor => {

        const dialog = this.dialog;

        editor.on('keyup', () => {

          const content = editor.getContent();
          this.editorKeyup.emit(content);
        });

        editor.addMenuItem('myitem', {
          text: 'Add Image',
          context: 'tools',
          onclick: () => {
            const ImageSelectDialog = dialog.open(ImageSelectComponent, {
              data: {
                image_request: this.articleRequestService.makeGetRequest('image.images'),
                thumb_image_url: this.articleRequestService.makeUrl('image.image')
              }
            });

            const rq1 = ImageSelectDialog.afterClosed().subscribe(response => {
              editor.insertContent(
                `<img src="${response.thumb_url}" alt="${response.alt}" width="${response.width}" height="${response.height}" />`
              );

              rq1.unsubscribe();
            });
          }
        });

        this.editor = editor;
      },
    });
  }

  addLanguageArticle(f: NgForm) {
    const rq1 = this.articleRequestService.putArticleContent(this.article.id, {
      title: f.value.title,
      sub_title: f.value.sub_title,
      body: tinymce.activeEditor.getContent(),
      keywords: this.keywords,
      published: f.value.published ? 1 : 0,
      language_id: f.value.language_id
    }).subscribe((response) => alert('success'));

    this.subs.add(rq1);
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our keyword
    if ((value || '').trim()) {
      this.keywords.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(keyword: any): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }
}
