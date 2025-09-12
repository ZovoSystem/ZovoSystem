import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { Layout } from './components/layout/layout';
import { Caixa } from './components/caixa/caixa';
import { Estoque } from './components/estoque/estoque';
import { EstoqueProduto } from './components/estoque-produto/estoque-produto';
import { EstoqueMovimentacao } from './components/estoque-movimentacao/estoque-movimentacao';

@NgModule({
  declarations: [
    App,
    Layout,
    Caixa,
    Estoque,
    EstoqueProduto,
    EstoqueMovimentacao
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
