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

  initTinymce(tinymce: any, dialog:any, subs:any, component:any, requestService:any, callback: any): void {
    tinymce.init({
      height: '420px',
      plugins: ['link', 'paste', 'table', 'image', 'fullscreen'],
      selector: '#' + 'tinymce-textarea',
      skin_url: '/assets/skins/oxide',
      toolbar: 'image myitem',
      image_advtab: true,
      setup: editor => {

        editor.ui.registry.addButton('myitem', {
          text: 'Resim Ekle',
          onAction: (_) => {

            subs.add(
              this.insertImageIntoEditor(dialog, component, {
                image_request: requestService.makeGetRequest('image.images'),
                thumb_image_url: requestService.makeUrl('storage.images')
              }).subscribe(response =>
                editor.insertContent(
                  `<img src="${response.thumb_url}" alt="${response.alt}" width="${response.width}" height="${response.height}" />`
                )
              )
            );
          }
        });

        callback(editor);
      },
    });
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
