import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CacheService, HelpersService, ImageSelectComponent } from '../../imports';

import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';

import { ArticlePermissionComponent } from '../../dialogs/article-permission/article-permission.component';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.sass']
})
export class ArticleEditComponent implements OnInit {

  article: any;

  categories: Array<any> = [];

  API_URL: any;

  THUMB_IMAGE_URL: string;

  user: any;

  subs = new Subscription();

  get isPageReady() {
    return this.article && this.categories;
  }

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private articleRequestService: ArticleRequestService,
    private articleService: ArticleService,
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

        const rq = this.cacheService
          .get('categories', this.articleRequestService.makeGetRequest('admin.categories'))
          .subscribe((categories: Array<any>) => {
            this.categories = Array.from(categories);

            for (const category of this.categories) {
              const index = response.categories.findIndex(_category => category.id === _category.id);
              category.exist = index !== -1;
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

  postArticle(f: NgForm) {
    const categories = this.categories.filter(category => category.exist).map(category => category.id);

    const rq1 = this.articleRequestService.postArticle(this.article.id, {
      slug: f.value.slug,
      categories: categories,
      image: f.value.image
    }).subscribe(response => {
      this.articleService.openSnack(this.snackBar, response, response.state === 'success');

      this.helpersService.navigate(['/article/edit', f.value.slug]);
    });

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
