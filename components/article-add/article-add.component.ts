import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CacheService, HelpersService, ImageSelectComponent } from '../../imports';
import { ArticleRequestService } from '../../services/article-request.service';
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

  imageName: string;

  subs = new Subscription();

  @ViewChild('tiny', { static: false }) set tiny(tiny: any) {
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
    this.service.initTinymce(
      tinymce,
      this.dialog,
      this.subs,
      ImageSelectComponent,
      this.requestService,
      (editor: any) => { this.editor = editor; });
  }

  addArticle(f: NgForm) {
    if (!f.valid) {
      return;
    }

    const categories = this.categories.filter(category => category.exist).map(category => category.id);

    const keywords = [];

    for (const keyw of f.value.keywords.split(',')) {
      if (keyw !== '') {
        keywords.push(keyw);
      }
    }
    this.subs.add(
      this.requestService.putArticle({
        title: f.value.title,
        sub_title: f.value.sub_title,
        body: tinymce.activeEditor.getContent(),
        keywords: keywords,
        published: f.value.published ? 1 : 0,
        language_id: f.value.language_id,
        slug: f.value.slug,
        category: categories,
        image: this.imageName
      }).subscribe(response => this.helpersService.navigate(['/articles']))
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

        this.imageName = response.u_id;
      })
    );
  }
}
