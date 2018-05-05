import { TestBed, inject } from '@angular/core/testing';

import { ArticleRequestService } from './article-request.service';

describe('ArticleRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticleRequestService]
    });
  });

  it('should be created', inject([ArticleRequestService], (service: ArticleRequestService) => {
    expect(service).toBeTruthy();
  }));
});
