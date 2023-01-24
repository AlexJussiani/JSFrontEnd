import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Conta } from '../../models/contas';

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html'
})
export class ReceberDetalheComponent implements OnInit {

  conta: Conta = new Conta();
  constructor(
    private route: ActivatedRoute,
  ) {
    this.conta = this.route.snapshot.data['conta'];
   }

  ngOnInit(): void {
  }

}
