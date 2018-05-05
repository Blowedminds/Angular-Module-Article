import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContentAddComponent } from './article-content-add.component';

describe('ArticleContentAddComponent', () => {
  let component: ArticleContentAddComponent;
  let fixture: ComponentFixture<ArticleContentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleContentAddComponent ]
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
