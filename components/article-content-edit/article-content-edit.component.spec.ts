import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentEditComponent } from './article-content-edit.component';

describe('ArticleContentEditComponent', () => {
  let component: ArticleContentEditComponent;
  let fixture: ComponentFixture<ArticleContentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleContentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleContentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
