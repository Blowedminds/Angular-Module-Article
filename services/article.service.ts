import { Injectable } from '@angular/core';

import { MainService } from '../imports';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material';

@Injectable()
export class ArticleService extends MainService {

  constructor() {
    super();
  }

  insertImageIntoEditor(dialog: any, component: any, data: any): Observable<any> {
    const ImageSelectDialog = dialog.open(component, {
      data: data
    });

    return ImageSelectDialog.afterClosed();
  }

  addKeyword(event: MatChipInputEvent, keywords: Array<string>): void {
    const input = event.input;
    const value = event.value;
    // Add our keyword
    if ((value || '').trim()) {
      keywords.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(keyword: string, keywords: Array<string>): void {
    const index = keywords.indexOf(keyword);

    if (index >= 0) {
      keywords.splice(index, 1);
    }
  }
}
