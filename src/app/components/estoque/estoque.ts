import { Component, OnInit } from '@angular/core';
import { EstoqueService } from './estoque.service';

@Component({
  selector: 'app-estoque',
  standalone: false,
  templateUrl: './estoque.html',
  styleUrl: './estoque.css'
})

export class Estoque implements OnInit {

  termoPesquisa = ''

  produtosEstoque: Array<{
    codigoProduto: number
    codigoBarras: number
    nome: string
    valorVenda: string
    quantidadeEstoque: number
    quantidadeEstoqueMinimo: number
  }> = []

  constructor(private estoqueService: EstoqueService) { }

  ngOnInit(): void {
    this.buscarProdutos()
  }

  buscarProdutos() {
    this.estoqueService.listar().subscribe({
      next: (dados) => {
        this.produtosEstoque = dados
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err)
      }
    })
  }

  buscarProdutosPorTermo() {
    const termo = this.termoPesquisa.trim()
    if (!termo) {
      this.buscarProdutos()
      return
    }

    this.estoqueService.buscarProdutos(this.termoPesquisa).subscribe({
      next: (dados) => {
        this.produtosEstoque = dados
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err)
      }
    })
  }

  zeraStorage() {
    sessionStorage.clear()
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault() // impede o menu padrão do navegador
    // alert("Tudo puta")
    // // aqui você chama sua função
  }

}

