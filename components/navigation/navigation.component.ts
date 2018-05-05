import { Component, OnInit } from '@angular/core';

import { MainNavigationComponent, MainRequestService, CacheService } from '../../imports';

@Component({
  selector: 'app-navigation',
  templateUrl: '../../../shared/components/main-navigation/main-navigation.component.html',
  styleUrls: ['../../../shared/components/main-navigation/main-navigation.component.sass']
})
export class NavigationComponent extends MainNavigationComponent {

  constructor(
    private mainRequestService: MainRequestService,
    private cacheService: CacheService
  )
  {
    super();
  }

  ngOnInit() {

    this.cacheService.get('menus', this.mainRequestService.makeGetRequest('user.menus'))
                      .subscribe(response => this.menus = response);

    this.cacheService.get('user', this.mainRequestService.makeGetRequest('user.info'))
                      .subscribe(response => this.user = response);
  }

}
