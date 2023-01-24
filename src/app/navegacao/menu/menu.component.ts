import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {

  active = 1;

  public isCollapsed = true;

  constructor(){
    this.isCollapsed = true;
  }
}
