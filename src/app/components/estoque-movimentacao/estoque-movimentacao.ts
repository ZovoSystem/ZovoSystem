import { EstoqueMovimentacaoService } from './estoque-movimentacao.service';
import { EstoqueProduto } from './../estoque-produto/estoque-produto';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-estoque-movimentacao',
  standalone: false,
  templateUrl: './estoque-movimentacao.html',
  styleUrl: './estoque-movimentacao.css'
})
export class EstoqueMovimentacao implements OnInit {
  produtoId: string | null = null

  modalAberto = 0

  produto: {
    codigoProduto: number
    codigoBarras: string
    nome: string
    descricao: string
    valorVenda: number
    quantidadeEstoqueMinimo: number
  } | null = null

  movimentacao = {
    tipo: 0,
    quantidade: 0,
    precoCusto: 0,
    observacao: ''
  }

  novaVenda = {
    codigoBarras: '',
    nome: '',
    descricao: '',
    quantidadeEstoqueMinimo: 0,
    valorVenda: 0,
    movimentacao: {
      tipo: 1,
      quantidade: 0,
      precoCusto: 0,
      observacao: ''
    }
  }

  movimentacoesRealizadas: {
    id: number,
    dataHoraMovimentacao: string,
    tipo: number,
    quantidade: number,
    observacao: string
  }[] = []


  constructor(
    private route: ActivatedRoute,
    private estoqueMovimentacaoService: EstoqueMovimentacaoService
  ) { }

  ngOnInit() {
    this.produtoId = this.route.snapshot.paramMap.get('id')
    if (this.produtoId === 'null') {
      const produtoString = sessionStorage.getItem('produtoTemp')

      if (produtoString) {
        this.produto = JSON.parse(produtoString)

        this.novaVenda.codigoBarras = this.produto.codigoBarras
        this.novaVenda.nome = this.produto.nome
        this.novaVenda.descricao = this.produto.descricao
        this.novaVenda.quantidadeEstoqueMinimo = this.produto.quantidadeEstoqueMinimo
        this.novaVenda.valorVenda = this.produto.valorVenda

      } else {
        console.warn('Produto não encontrado no sessionStorage')
      }
    }

    if (this.produtoId != 'null') {
      this.buscarMovimentacoes()
    }
  }

  buscarMovimentacoes() {
    this.estoqueMovimentacaoService.buscarMovimentacoes(this.produtoId).subscribe({
      next: (movimentacoesRealizadas) => {
        this.movimentacoesRealizadas = movimentacoesRealizadas
      },
      error: (err) => {
        console.error('Erro ao buscar movimentações:', err)
      }
    })
  }

  criarProduto() {
    this.novaVenda.movimentacao.tipo = 1
    this.novaVenda.movimentacao.quantidade = this.movimentacao.quantidade
    this.novaVenda.movimentacao.precoCusto = this.movimentacao.precoCusto
    this.novaVenda.movimentacao.observacao = this.movimentacao.observacao

    this.estoqueMovimentacaoService.criarProduto(this.novaVenda)
      .subscribe({
        next: (res) => {
          console.log('Produto criado com sucesso!')
        },
        error: (err) => {
          console.warn('Erro ao atualizar:', err)
        }
      })
  }

  adicionarMovimentacaoEstoque() {
    if(this.modalAberto === 1) {
      this.movimentacao.tipo = 4
    }
    if(this.modalAberto === 2) {
      this.movimentacao.tipo = 3
    }
    
    this.estoqueMovimentacaoService.adicionarMovimentacao(this.produtoId, this.movimentacao)
    .subscribe({
      next: (res) => {
        this.modalAberto = 0
        this.buscarMovimentacoes()
      },
      error: (err) => {
        console.error('Erro ao adicionar movimentação', err)
        this.fecharModal()
      }
    })
  }

  adicionarMovimentacao() {
    if (this.produtoId === 'null') {
      this.criarProduto()
    }
    if (this.produtoId != 'null') {
      this.adicionarMovimentacaoEstoque()
    }
  }

  reporEstoque() {
    this.modalAberto = 1
  }

  baixarEstoque() {
    this.modalAberto = 2
  }

  fecharModal() {
    this.modalAberto = 0
  }
}




