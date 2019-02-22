import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ArticleRequestService } from '../../services/article-request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-permission',
  templateUrl: './article-permission.component.html',
  styleUrls: ['./article-permission.component.sass']
})
export class ArticlePermissionComponent implements OnInit, OnDestroy {

  users: any;

  subs = new Subscription();

  get isPageReady() {
    return this.users && true;
  }

  constructor(
    private articleRequestService: ArticleRequestService,
    @Inject(MAT_DIALOG_DATA) private dialog_data: any,
    private dialogRef: MatDialogRef<ArticlePermissionComponent>,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.articleRequestService.getPermission(this.dialog_data.id)
        .subscribe(response => this.users = response.users)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  updatePermission() {
    const permissions = this.users.filter((user) => user.permission).map((user) => user.user_id);

    this.subs.add(
      this.articleRequestService.putPermission(this.dialog_data.id, permissions)
        .subscribe(response => this.dialogRef.close(response))
    );
  }

}
