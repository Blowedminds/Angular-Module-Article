import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ArticleRoutingModule } from './article-routing.module';

import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleAddComponent } from './components/article-add/article-add.component';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';
import { ArticleContentAddComponent } from './components/article-content-add/article-content-add.component';
import { ArticleContentEditComponent } from './components/article-content-edit/article-content-edit.component';
import { ArticleTrashComponent } from './components/article-trash/article-trash.component';

import { ArticlePermissionComponent } from './dialogs/article-permission/article-permission.component';

import { ArticleRequestService } from './services/article-request.service';
import { ArticleService } from './services/article.service';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleAddComponent,
    ArticleEditComponent,
    ArticleContentAddComponent,
    ArticleContentEditComponent,
    ArticleTrashComponent,
    ArticlePermissionComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule,
    CoreModule
  ],
  providers: [
    ArticleService,
    ArticleRequestService
  ],
  entryComponents: [
    ArticlePermissionComponent
  ]
})

export class ArticleModule { }
