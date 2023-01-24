import { LocalStorageUtils } from './../utils/localstorage';
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from 'src/environments/environment';

export abstract class BaseService{

  public LocalStorage = new LocalStorageUtils();
  protected UrlServiceIdentidadeV1: string = environment.apiUrlIdentidadeV1;
  protected UrlServiceClientesV1: string = environment.apiUrlClientesV1;
  protected UrlServiceProdutosV1: string = environment.apiUrlProdutosV1;
  protected UrlServiceContasV1: string = environment.apiUrlContasV1;
  protected UrlServiceGatewayV1: string = environment.apiUrlGatewayV1;
  protected UrlMovimentacaoFinanceiraV1: string = environment.apiUrlMovimentacaoV1;


  protected ObterHeaderJson() {
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
  }

  protected ObterAuthHeaderJson() {
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.LocalStorage.obterTokenUsuario()}`
        })
    };
}

  protected extractData(response: any){
    return response || {};
  }

  protected serviceError(response: Response | any) {
    let customError: string[] = [];
    let customResponse = { error: { errors: {Mensagens: []}}}

    if (response instanceof HttpErrorResponse) {

        if (response.statusText === "Unknown Error") {
            customError.push("Ocorreu um erro desconhecido");
            response.error.errors = customError;
            console.error(response.error.errors);
        }
    }
    if (response.status === 500) {
        customError.push("Ocorreu um erro no processamento, tente novamente mais tarde ou contate o nosso suporte.");

        // Erros do tipo 500 não possuem uma lista de erros
        // A lista de erros do HttpErrorResponse é readonly
        customResponse.error.errors.Mensagens = customError;
        return throwError(() => customResponse);
    }

    console.error(response);
    return throwError(() => response);
}
}
