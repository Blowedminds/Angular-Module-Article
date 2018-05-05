import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTrashComponent } from './article-trash.component';

describe('ArticleTrashComponent', () => {
  let component: ArticleTrashComponent;
  let fixture: ComponentFixture<ArticleTrashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleTrashComponent ]
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
