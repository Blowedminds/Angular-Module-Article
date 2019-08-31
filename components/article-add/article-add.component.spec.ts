import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAddComponent } from './article-add.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';
import { TestingHelper, NavigationModule } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArticleAddComponent', () => {
  let component: ArticleAddComponent;
  let fixture: ComponentFixture<ArticleAddComponent>;

  const testingHelper = new TestingHelper();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleAddComponent ],
      providers: [
        ArticleRequestService,
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
    fixture = TestBed.createComponent(ArticleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
