import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import * as tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/table';
import 'tinymce/plugins/image';
import 'tinymce/plugins/fullscreen';

import { CacheService, ImageSelectComponent } from '../../imports';
import { ArticleRequestService } from '../../services/article-request.service';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-article-content-edit',
  templateUrl: './article-content-edit.component.html',
  styleUrls: ['./article-content-edit.component.sass']
})
export class ArticleContentEditComponent implements OnInit, OnDestroy {

  article: any;

  language: any;

  @Input() elementId = 'tinymce-textarea';

  @Output() editorKeyup = new EventEmitter<any>();

  editor: any;

  subs = new Subscription();

  separatorKeysCodes = [ENTER, COMMA];

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
    private articleRequestService: ArticleRequestService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    const rq1 = this.route.params.pipe(
      switchMap((params: Params) =>
        this.articleRequestService.getArticleByContent(params['slug'], params['language_slug'])
      ))
      .subscribe((response: any) => {

        this.article = response;

        const rq2 = this.cacheService.get('languages', this.articleRequestService.makeGetRequest('admin.languages'))
          .subscribe(languages => {
            this.language = languages.find(language => language.id === response.content.language_id);
          });

        // this.subs.add(rq2)
      });

    this.subs.add(rq1);
  }

  runTinymce() {
    tinymce.init({
      height: '420px',
      plugins: ['link', 'paste', 'table', 'image'],
      selector: '#' + this.elementId,
      skin_url: '/assets/skins/lightgray',
      toolbar: 'image',
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

    tinymce.activeEditor.setContent(this.article.content.body);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);

    this.subs.unsubscribe();
  }

  editArticle(f: NgForm) {
    const rq2 = this.articleRequestService.postArticleContent(this.article.id, {
      title: f.value.title,
      sub_title: f.value.sub_title,
      body: tinymce.activeEditor.getContent(),
      keywords: this.article.content.keywords,
      published: f.value.published ? 1 : 0,
      language_id: this.article.content.language_id,
    }).subscribe(response => alert('success'));

    this.subs.add(rq2);
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      this.article.content.keywords.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(keyword: any): void {
    const index = this.article.content.keywords.indexOf(keyword);

    if (index >= 0) {
      this.article.content.keywords.splice(index, 1);
    }
  }
}
