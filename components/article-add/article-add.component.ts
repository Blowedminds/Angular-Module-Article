import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { NgForm } from '@angular/forms';

import { CacheService, HelpersService, ImageSelectComponent } from '../../imports';
import { ArticleRequestService } from '../../services/article-request.service';

import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ArticleService } from '../../services/article.service';

declare var tinymce: any;

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.sass']
})
export class ArticleAddComponent implements OnInit, OnDestroy {

  editor: any;

  languages: any;

  categories: Array<any> = [];

  keywords: Array<string> = [];

  image_name: string;

  separatorKeysCodes = [ENTER, COMMA];

  subs = new Subscription();

  @ViewChild('tiny') set tiny(tiny: any) {
    if (this.isPageReady) {
      setTimeout(() => this.runTinymce(), 0);
    }
  }

  get isPageReady() {

    return this.languages && this.categories;
  }

  constructor(
    private requestService: ArticleRequestService,
    private service: ArticleService,
    private cacheService: CacheService,
    private helpersService: HelpersService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.cacheService.get('languages', this.requestService.makeGetRequest('admin.languages'))
      .subscribe(response => this.languages = response.slice(0));

    this.cacheService.get('categories', this.requestService.makeGetRequest('admin.categories'))
      .subscribe(response => {
        this.categories = Array.from(response);

        this.categories.map(category => {
          category.exist = false;
          return category;
        });
      });
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
      setup: (editor: any) => {

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
      }
    });
  }

  addArticle(f: NgForm) {
    const categories = this.categories.filter(category => category.exist).map(category => category.id);

    this.subs.add(
      this.requestService.putArticle({
        title: f.value.title,
        sub_title: f.value.sub_title,
        body: tinymce.activeEditor.getContent(),
        keywords: this.keywords,
        published: f.value.published ? 1 : 0,
        language_id: f.value.language_id,
        slug: f.value.slug,
        category: categories,
        image: this.image_name
      }).subscribe(response => {

        if (f.value.forum_published && f.value.published) {
          const languageSlug = this.languages.find(language => language.id === f.value.language_id);
          const url = `${environment.discussUrl}?article=${f.value.slug}&language=${languageSlug.slug}#new_topic`;
          window.location.href = url;
        } else {
          this.helpersService.navigate(['/articles']);
        }
      })
    );
  }

  openImageSelect() {
    const dialogRef = this.dialog.open(ImageSelectComponent, {
      data: {
        image_request: this.requestService.makeGetRequest('image.images'),
        thumb_image_url: this.requestService.makeUrl('storage.images.thumbs')
      }
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(response => {

        const el = document.getElementById('img');

        el.setAttribute('src', response.thumb_url);

        this.image_name = response.u_id;
      })
    );
  }
}
