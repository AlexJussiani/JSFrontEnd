import { Endereco } from './endereco';

export class Cliente {
    id: string;
    nome: string;
    email?: Email;
    cpf: Cpf;
    telefone: string;
    excluido: boolean;
    endereco?: Endereco;
    notificacoes?: any;
    ehCliente: boolean;
    ehFornecedor: boolean;
}

export class Cpf {
  numero: string
}

export class Email {
  endereco?: string
}
