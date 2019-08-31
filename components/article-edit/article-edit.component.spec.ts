import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleEditComponent } from './article-edit.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';
import { TestingHelper, NavigationModule } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ArticlePermissionComponent } from '../../dialogs/article-permission/article-permission.component';

describe('ArticleEditComponent', () => {
  let component: ArticleEditComponent;
  let fixture: ComponentFixture<ArticleEditComponent>;

  const testingHelper = new TestingHelper();

  const articleRequestStub = {
    makeUrl: (param1) => '',
    makeGetRequest: (param1, param2) => {
      return throwError({});
    },
    getArticle: (param1) => {
      return throwError('test');
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleEditComponent],
      providers: [
        { provide: ArticleRequestService, useValue: articleRequestStub },
        ArticleService
      ],
      imports: [
        NavigationModule,
        RouterTestingModule.withRoutes(testingHelper.routes)
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleEditComponent);
    console.log(fixture.debugElement.injector.get(ArticleRequestService));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log(component);

    expect(component).toBeTruthy();
  });
});
