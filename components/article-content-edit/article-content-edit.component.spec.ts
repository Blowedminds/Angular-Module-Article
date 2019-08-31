import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentEditComponent } from './article-content-edit.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';
import { TestingHelper, NavigationModule } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ArticleContentEditComponent', () => {
  let component: ArticleContentEditComponent;
  let fixture: ComponentFixture<ArticleContentEditComponent>;

  const testingHelper = new TestingHelper();

  const articleRequestStub = {
    makeUrl: () => '',
    makeGetRequest: (param1, param2) => of({}),
    getArticleByContent: (param1, param2) => of({ user_id: 'test' })
  };

  console.log(articleRequestStub);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleContentEditComponent],
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
    fixture = TestBed.createComponent(ArticleContentEditComponent);
    console.log(fixture.debugElement.injector.get(ArticleRequestService));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
