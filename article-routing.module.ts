import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleAddComponent } from './components/article-add/article-add.component';
import { ArticleContentAddComponent } from './components/article-content-add/article-content-add.component';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';
import { ArticleContentEditComponent } from './components/article-content-edit/article-content-edit.component';
import { ArticleTrashComponent } from './components/article-trash/article-trash.component';
import { NavigationComponent } from './components/navigation/navigation.component';

const routes = [
  {
    path: '', component: NavigationComponent, children: [
      { path: 'articles', component: ArticlesComponent },
      { path: 'articles/trash', component: ArticleTrashComponent },
      { path: 'article/add', component: ArticleAddComponent },
      { path: 'article/edit/:slug', component: ArticleEditComponent },
      { path: 'article/content/add/:slug', component: ArticleContentAddComponent },
      { path: 'article/content/edit/:slug/:language_slug', component: ArticleContentEditComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      { enableTracing: false }
    )],
  exports: [
    RouterModule
  ]
})
export class ArticleRoutingModule { }
