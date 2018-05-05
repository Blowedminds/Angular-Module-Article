import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ArticleRequestService } from '../../services/article-request.service';

@Component({
  selector: 'app-article-permission',
  templateUrl: './article-permission.component.html',
  styleUrls: ['./article-permission.component.sass']
})
export class ArticlePermissionComponent implements OnInit {

  data: any

  have_permission: any

  not_have_permission: any

  change_have_permission: Array<any> = []

  change_not_have_permission: Array<any> = []

  get isPageReady()
  {
    return this.have_permission && this.not_have_permission;
  }

  constructor(
    private articleRequestService: ArticleRequestService,
    @Inject(MAT_DIALOG_DATA) private dialog_data: any,
    private dialogRef: MatDialogRef<ArticlePermissionComponent>,
  ) { }

  ngOnInit() {
    let rq1 = this.articleRequestService.getPermission(this.dialog_data.id).subscribe(response => {

      this.have_permission = response.users.filter( obj => {
        for( let one of response.permission){
          if(obj.user_id === one.user_id) return true
        }
        return false
      })

      for(let one of response.permission){
        let index = response.users.findIndex( obj => obj.user_id === one.user_id)

        if(index != -1) response.users.splice(index, 1)
      }

      this.not_have_permission = response.users

      rq1.unsubscribe()
      rq1 = null
    })
  }

  addUser(i: number)
  {
    let item = this.not_have_permission[i]

    if(!item.key){
      item.key = true

      this.change_have_permission.push(item)
    }else{
      delete this.not_have_permission[i].key

      let index = this.change_not_have_permission.findIndex( obj => obj.user_id === item.user_id)

      this.change_not_have_permission.splice(index, 1)
    }

    this.have_permission.push(item)

    this.not_have_permission.splice(i, 1)
  }

  discardUser(i: number)
  {
    let item = this.have_permission[i]

    if(!item.key){

      item.key = true

      this.change_not_have_permission.push(item)
    }else{
      delete this.have_permission[i].key

      let index = this.change_not_have_permission.findIndex( obj => obj.user_id === item.user_id)

      this.change_have_permission.splice(index, 1)
    }

    this.not_have_permission.push(this.have_permission[i])

    this.have_permission.splice(i, 1)
  }

  consoleLog()
  {
    console.log(this.change_have_permission, this.change_not_have_permission)
  }

  updatePermission()
  {
    if(this.change_have_permission.length == 0 && this.change_not_have_permission.length == 0 ){

      this.dialogRef.close()
      return
    }

    let rq2 = this.articleRequestService.putPermission(this.dialog_data.id, this.change_have_permission, this.change_not_have_permission).subscribe(response => {
      this.dialogRef.close()

      rq2.unsubscribe()
      rq2 = null
    })
  }

}
