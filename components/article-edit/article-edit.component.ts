import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CacheService, HelpersService, ImageSelectComponent } from '../../imports';

import { ArticleRequestService } from '../../services/article-request.service';

import { ArticlePermissionComponent } from '../../dialogs/article-permission/article-permission.component';
// import { ImageSelectComponent, ArticlePermission } from '../../../exports/dialogs';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.sass']
})
export class ArticleEditComponent implements OnInit {

  article: any;

  categories: any;

  add_categories: any;

  API_URL: any;

  THUMB_IMAGE_URL: string;

  user: any;

  subs = new Subscription();

  get isPageReady() {
    return !!this.article;
  }

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private articleRequestService: ArticleRequestService,
    private cacheService: CacheService,
    private helpersService: HelpersService
  ) {
    this.THUMB_IMAGE_URL = this.articleRequestService.makeUrl('image.thumb');
  }

  ngOnInit() {
    const rq1 = this.route.params
      .pipe(switchMap((params: Params) =>
        this.articleRequestService.getArticle(params['slug'])
      ))
      .subscribe((response: any) => {

        this.article = response;

        this.categories = response.categories;

        const rq = this.cacheService
          .get('categories', this.articleRequestService.makeGetRequest('admin.categories'))
          .subscribe(categories => {

            this.add_categories = categories;

            for (const category of this.categories) {

              this.add_categories = this.add_categories.filter(obj => obj.id !== category.id);
            }
          });

        this.subs.add(rq);
      });

    const rq2 = this.cacheService.get('user', this.articleRequestService.makeGetRequest('user.info'))
      .subscribe(response => this.user = response);

    this.subs.add(rq1).add(rq2);
  }

  getToken() {
    return this.helpersService.getToken();
  }

  addCategory(item: any) {
    if (item.selected.value === undefined || item.selected.value == null) {

      return;
    }

    const index = this.add_categories.findIndex(obj => obj.id === item.selected.value);

    this.categories.push(this.add_categories[index]);

    this.add_categories.splice(index, 1);
  }

  deleteCategory(item: any) {
    this.add_categories.push(this.categories[item]);

    this.categories.splice(item, 1);
  }

  editArticle(f: NgForm) {
    const categories = this.categories.map(category => category.id);

    const rq1 = this.articleRequestService.postArticle(this.article.id, {
      slug: f.value.slug,
      categories: categories,
      image: f.value.image
    }).subscribe(response => this.helpersService.navigate(['/article/edit', f.value.slug]));

    this.subs.add(rq1);
  }

  deleteArticle() {
    const rq2 = this.articleRequestService.deleteArticle(this.article.id)
      .subscribe(response => this.helpersService.navigate(['/articles']));

    this.subs.add(rq2);
  }

  openImageSelect() {
    const dialogRef = this.dialog.open(ImageSelectComponent, {
      data: {
        image_request: this.articleRequestService.makeGetRequest('image.images'),
        thumb_image_url: this.articleRequestService.makeUrl('image.thumb')
      }
    });

    const rq3 = dialogRef.afterClosed().subscribe(response => {

      if (response) {

        const element = document.getElementById('img');

        element.setAttribute('src', response.thumb_url);

        this.article.image = response.u_id;
      }
    });

    this.subs.add(rq3);
  }

  openManagePermission() {
    const dialogRef = this.dialog.open(ArticlePermissionComponent, {
      data: {
        id: this.article.id,
      }
    });

    const rq4 = dialogRef.afterClosed().subscribe(response => alert('success'));

    this.subs.add(rq4);
  }
}
