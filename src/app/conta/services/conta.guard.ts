import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LocalStorageUtils } from "src/app/utils/localstorage";
import { CadastroComponent } from "../cadastro/cadastro.component";

@Injectable()
export class ContaGuard implements CanDeactivate<CadastroComponent>{

  localStorageUtils = new LocalStorageUtils();

  constructor(private router: Router){}
  canDeactivate(component: CadastroComponent) {
    if(component.mudancasNaoSalvas) {
      return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulario?');
  }

  return true
  }

  canActivate() {
    if(this.localStorageUtils.obterTokenUsuario()){
        this.router.navigate(['/home']);
    }

    return true;
}

}
