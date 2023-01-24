import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotFoundComponent } from './not-found/not-found.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { MenuLoginComponent } from './menu-login/menu-login.component';

@NgModule({
  declarations: [
    MenuComponent,
    HomeComponent,
    FooterComponent,
    NotFoundComponent,
    MenuLoginComponent,
    AcessoNegadoComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports:[
    MenuComponent,
    MenuLoginComponent,
    HomeComponent,
    FooterComponent,
    NotFoundComponent,
    AcessoNegadoComponent
  ]
})
export class NavegacaoModule{  }
