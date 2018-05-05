import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePermissionComponent } from './article-permission.component';

describe('ArticlePermissionComponent', () => {
  let component: ArticlePermissionComponent;
  let fixture: ComponentFixture<ArticlePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePermissionComponent ]
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
