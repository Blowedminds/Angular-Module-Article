import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentAddComponent } from './article-content-add.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';
import { TestingHelper, NavigationModule } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArticleContentAddComponent', () => {
  let component: ArticleContentAddComponent;
  let fixture: ComponentFixture<ArticleContentAddComponent>;

  const testingHelper = new TestingHelper();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleContentAddComponent ],
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
    fixture = TestBed.createComponent(ArticleContentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
