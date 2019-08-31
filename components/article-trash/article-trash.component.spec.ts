import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTrashComponent } from './article-trash.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { ArticleService } from '../../services/article.service';
import { TestingHelper, NavigationModule } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

describe('ArticleTrashComponent', () => {
  let component: ArticleTrashComponent;
  let fixture: ComponentFixture<ArticleTrashComponent>;

  const testingHelper = new TestingHelper();

  const articleRequestStub = {
    getTrash: () => new Observable()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleTrashComponent ],
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
    fixture = TestBed.createComponent(ArticleTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
