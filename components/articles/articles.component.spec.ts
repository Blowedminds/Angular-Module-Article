import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesComponent } from './articles.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';
import { TestingHelper, NavigationModule } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;

  const testingHelper = new TestingHelper();

  const articleRequestStub = {
    getTrash: () => new Observable(),
    makeGetRequest: () => new Observable()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
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
    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
