import { FinanceiroService } from './financeiro.service';
import { Conta } from './../models/contas';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";

@Injectable()
export class FinanceiroResolve implements Resolve<Conta> {

    constructor(private financeiroService: FinanceiroService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.financeiroService.obterPorId(route.params['id']);
    }
}
