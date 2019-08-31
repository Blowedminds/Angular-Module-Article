import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePermissionComponent } from './article-permission.component';
import { ArticleRequestService } from '../../services/article-request.service';
import { NavigationModule, TestingHelper } from '../../imports';
import { RouterTestingModule } from '@angular/router/testing';


describe('ArticlePermissionComponent', () => {
  let component: ArticlePermissionComponent;
  let fixture: ComponentFixture<ArticlePermissionComponent>;

  const testingHelper = new TestingHelper();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePermissionComponent ],
      providers: [
        ArticleRequestService
      ],
      imports: [
        NavigationModule,
        RouterTestingModule.withRoutes(testingHelper.routes)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
