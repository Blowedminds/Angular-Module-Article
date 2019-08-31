import { TestBed, inject, async } from '@angular/core/testing';

import { ArticleRequestService } from './article-request.service';
import { TestingHelper } from '../imports';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../imports';
import { RouterTestingModule } from '@angular/router/testing';
import { catchError } from 'rxjs/operators';

describe('ArticleRequestService', () => {

  let requestService: ArticleRequestService;

  const testingHelper = new TestingHelper();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleRequestService],
      imports: [
        HttpClientModule,
        CoreModule,
        RouterTestingModule.withRoutes(testingHelper.routes)
      ]
    });

    requestService = TestBed.get(ArticleRequestService);

  });

  it('should be created', inject([ArticleRequestService], (service: ArticleRequestService) => {
    expect(service).toBeTruthy();
  }));

  it('should have correct route for getArticles', async(() => {
    requestService.getArticles()
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for getArticle', async(() => {
    requestService.getArticle('article')
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for getArticleByContent', async(() => {
    requestService.getArticleByContent('article', 'language')
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for getArticlesPaginate', async(() => {
    requestService.getArticlesPaginate({})
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for postArticle', async(() => {
    requestService.postArticle(0, {})
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for postArticleContent', async(() => {
    requestService.postArticleContent(0, {})
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for putArticle', async(() => {
    requestService.putArticle({})
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for putArticleContent', async(() => {
    requestService.putArticleContent(0, {})
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for deleteArticle', async(() => {
    requestService.deleteArticle(0)
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for getPermission', async(() => {
    requestService.getPermission(0)
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for putPermission', async(() => {
    requestService.putPermission(0, {})
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for getTrash', async(() => {
    requestService.getTrash()
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for postRestore', async(() => {
    requestService.postRestore(0)
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));

  it('should have correct route for deleteForceDelete', async(() => {
    requestService.deleteForceDelete(0)
      .pipe(catchError(error => testingHelper.unAuthenticatedError(error)))
      .subscribe(response => response, error => error);
  }));
});
