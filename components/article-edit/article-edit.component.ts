import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
export class ArticleEditComponent implements OnInit, OnDestroy {

  article: any;

  categories: Array<any> = [];

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
    private requestService: ArticleRequestService,
    private service: ArticleService,
    private cacheService: CacheService,
    private helpersService: HelpersService
  ) {
    this.THUMB_IMAGE_URL = this.requestService.makeUrl('storage.images.thumbs');
  }

  ngOnInit() {
    this.subs.add(
      this.route.params
        .pipe(switchMap((params: Params) =>
          this.requestService.getArticle(params['slug'])
        ))
        .subscribe((response: any) => {

          this.article = response;

          this.subs.add(
            this.cacheService.get('categories', this.requestService.makeGetRequest('admin.categories'))
              .subscribe((categories: Array<any>) => {
                this.categories = Array.from(categories);

                for (const category of this.categories) {
                  const index = response.categories.findIndex(_category => category.id === _category.id);
                  category.exist = index !== -1;
                }
              })
          );
        })
    );

    this.subs.add(
      this.cacheService.get('user', this.requestService.makeGetRequest('user.info'))
        .subscribe(response => this.user = response)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getToken() {
    return this.helpersService.getToken();
  }

  postArticle(f: NgForm) {
    const categories = this.categories.filter(category => category.exist).map(category => category.id);

    this.subs.add(
      this.requestService.postArticle(this.article.id, {
        slug: f.value.slug,
        categories: categories,
        image: f.value.image
      }).subscribe(response => this.service.openSnack(this.snackBar, response, response.state === 'success'))
    );
  }

  deleteArticle() {
    this.service.deleteAlert('Makaleyi Sil', () => {
      this.subs.add(
        this.requestService.deleteArticle(this.article.id)
          .subscribe(response => this.helpersService.navigate(['/articles']))
      );
    });
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

        if (response) {

          const element = document.getElementById('img');

          element.setAttribute('src', response.thumb_url);

          this.article.image = response.u_id;
        }
      })
    );
  }

  openManagePermission() {
    const dialogRef = this.dialog.open(ArticlePermissionComponent, {
      data: {
        id: this.article.id,
      }
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          this.service.openSnack(this.snackBar, response, response.state === 'success');
        }
      })
    );
  }
}
