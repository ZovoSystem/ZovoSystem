import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Layout } from './components/layout/layout';
import { Caixa } from './components/caixa/caixa';
import { Estoque } from './components/estoque/estoque'
import { EstoqueProduto } from './components/estoque-produto/estoque-produto';
import { EstoqueMovimentacao } from './components/estoque-movimentacao/estoque-movimentacao';
import { Vendas } from './components/vendas/vendas';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'caixa', pathMatch: 'full' },
      { path: 'caixa', component: Caixa },
      { path: 'estoque', component: Estoque },
      { path: 'produto', component: EstoqueProduto },
      { path: 'produto/:id', component: EstoqueProduto },
      { path: 'movimentacao', component: EstoqueMovimentacao },
      { path: 'movimentacao/:id', component: EstoqueMovimentacao },
      { path: 'vendas', component: Vendas }
    ]
  },
  { path: '**', redirectTo: 'caixa' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
