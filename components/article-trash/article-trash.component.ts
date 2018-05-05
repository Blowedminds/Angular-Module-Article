import { Component, OnInit, OnDestroy } from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

import { ArticleRequestService } from '../../services/article-request.service';

declare var swal: any;

@Component({
  selector: 'app-article-trash',
  templateUrl: './article-trash.component.html',
  styleUrls: ['./article-trash.component.sass']
})
export class ArticleTrashComponent implements OnInit, OnDestroy {

  data: any;

  displayedColumns: Array<string> = ['Author', 'Title', 'Deleted_At', 'ArticleId'];

  subs = new Subscription();

  constructor(
    private articleRequestService: ArticleRequestService
  ) { }

  dataBase: any =  new DataBase(this.articleRequestService);

  ngOnInit() {

    this.data = new DataSourceCode(this.dataBase);
  }

  ngOnDestroy()
  {
    this.subs.unsubscribe();
  }

  restoreArticle(article_id: number)
  {
    const rq1 = this.articleRequestService.postRestore(article_id)
                                .subscribe(response => this.data = new DataSourceCode(new DataBase(this.articleRequestService)));

    this.subs.add(rq1);
  }

  forceDeleteArticle(article_id: number)
  {
    const rq2 = this.articleRequestService.deleteForceDelete(article_id)
                            .subscribe(response => this.data = new DataSourceCode(new DataBase(this.articleRequestService)));

    this.subs.add(rq2);

  }

}

export class ArticleData {

  author: string;
  deleted_at: string;
  title: string;
  article_id: string;
}

export class DataBase {

  dataChange: BehaviorSubject<ArticleData[]> = new BehaviorSubject<ArticleData[]>([])

  get data(): ArticleData[] { return this.dataChange.value; }

  constructor(private article: ArticleRequestService) {

    let rq3 = this.article.getTrash().subscribe(response => {
      for(let one of response.data) {

        this.addContent(one);
      }
      rq3.unsubscribe();
      rq3 = null;
    });
  }

  addContent(content: any)
  {
    const copiedData = this.data.slice();
    copiedData.push(content);
    this.dataChange.next(copiedData);
  }
}

export class DataSourceCode extends DataSource<any> {

  constructor(private _dataBase: DataBase) {
    super();
  }

  connect(): Observable<any>
  {
    return this._dataBase.dataChange;
  }

  disconnect() {}
}
