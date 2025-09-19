import { Component } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit, HostListener, ViewChildren, QueryList } from '@angular/core'
import { CaixaServices } from './caixa.service';

@Component({
  selector: 'app-caixa',
  standalone: false,
  templateUrl: './caixa.html',
  styleUrl: './caixa.css'
})
export class Caixa implements AfterViewInit {
  produtos: { codigoProduto: number, codigoBarras: number, nome: string, valorVenda: number }[] = []
  @ViewChild('inputSeachProducts') inputSeachProducts!: ElementRef<HTMLInputElement>

  ngAfterViewInit() {
    this.inputSeachProducts.nativeElement.focus()
  }

  tirarFoco() {
    this.inputSeachProducts.nativeElement.blur()
  }

  @ViewChild('inputValor') inputValor!: ElementRef<HTMLInputElement>

  @ViewChildren('qtd') qtds!: QueryList<ElementRef>

  foco(index?: number) {
    const arr = this.qtds.toArray()
    const el = index != null ? arr[index]?.nativeElement : arr[arr.length - 1]?.nativeElement
    if (el) {
      el.focus()
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  controleSetinhasItensVenda(event: KeyboardEvent, index: number) {
    const qtdArray = this.qtds.toArray()

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const input = qtdArray[index + 1]
      if (input) {
        input.nativeElement.focus()
        const range = document.createRange()
        range.selectNodeContents(input.nativeElement)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const input = qtdArray[index - 1]
      if (input) {
        input.nativeElement.focus()
        const range = document.createRange()
        range.selectNodeContents(input.nativeElement)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }

  termoPesquisa = ''
  indexAtivo = -1
  linhaFoco = 0

  itensVenda: { codigoProduto: number, codigoBarras: string, nome: string, valorVenda: number, quantidade: number }[] = []

  resumoVenda: { subtotal: number, desconto: number, total: number, troco: number, pagamentos: { forma: string, valor: number }[] } = {
    subtotal: 0,
    desconto: 0,
    total: 0,
    troco: 0,
    pagamentos: [],
  }

  atualizarResumo() {
    this.resumoVenda.subtotal = this.itensVenda.reduce(
      (acc, item) => acc + item.valorVenda * item.quantidade, 0
    )

    this.resumoVenda.total = this.resumoVenda.subtotal - this.resumoVenda.desconto

    const somaPagamentos = this.resumoVenda.pagamentos.reduce((acc, p) => acc + p.valor, 0)
    this.resumoVenda.troco = somaPagamentos - this.resumoVenda.total
  }

  total() {
    return this.itensVenda.reduce((acc, item) => {
      return acc + (item.valorVenda * item.quantidade)
    }, 0)
  }

  itensDropDown: { codigoProduto: number, codigoBarras: number, nome: string, valorVenda: number }[] = []

  produtosEstoque: {
    codigoProduto: number
    codigoBarras: string
    nome: string
    valorVenda: number
  }[] = []


  buscarProdutosEstoquePorCodigoBarras(codigoBarras: string) {
    this.CaixaServices.buscarProdutosCodigoBarras(codigoBarras).subscribe({
      next: dados => {
        console.log(dados)

        const produto = dados
        const itemParaVenda = {
          codigoProduto: produto.codigoProduto,
          codigoBarras: produto.codigoBarras,
          nome: produto.nome,
          valorVenda: produto.valorVenda,
          quantidade: 1
        }

        this.itensVenda.push(itemParaVenda)
        this.atualizarResumo()
      },
      error: err => console.error(err)
    })
  }

  private searchTimeout: any

  pesquisarItens() {
    clearTimeout(this.searchTimeout)

    const termo = String(this.termoPesquisa).trim().toLowerCase()
    if (!termo) {
      this.itensDropDown = []
      return
    }

    this.searchTimeout = setTimeout(() => {
      this.CaixaServices.buscarProdutos(termo).subscribe({
        next: dados => {
          this.produtosEstoque = dados
          this.itensDropDown = dados
          this.indexAtivo = 0
        },
        error: err => console.error(err)
      })
    }, 300)
  }

  controleSetinhas(event: KeyboardEvent) {
    if (!this.itensDropDown.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.indexAtivo = (this.indexAtivo + 1) % this.itensDropDown.length
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.indexAtivo = (this.indexAtivo - 1 + this.itensDropDown.length) % this.itensDropDown.length
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      this.adicionarItem(this.itensDropDown[this.indexAtivo])
    }
  }

  subirVenda() {
    if (!this.itensVenda.length) {
      console.warn('Tentou subir venda sem itens')
      return
    }

    const novaVenda = {
      valorSubtotal: this.resumoVenda.subtotal,
      valorDesconto: this.resumoVenda.desconto,
      valorTotal: this.resumoVenda.total,
      valorTroco: this.resumoVenda.troco,
      pagamento: this.resumoVenda.pagamentos.map(p => ({
        forma: p.forma,
        valorPago: p.valor
      })),
      produtosVenda: this.itensVenda.map(item => ({
        produtoId: item.codigoProduto,
        quantidade: item.quantidade,
        valorUnitario: item.valorVenda
      }))
    }

    console.log('Payload novaVenda:', novaVenda)

    this.CaixaServices.criarVenda(novaVenda).subscribe({
      next: (res) => {
        console.log('Venda registrada com sucesso', res)
      },
      error: (err) => {
        console.error('Erro ao registrar venda', err)
        if (err.error) console.error('Resposta do backend:', err.error)
      }
    })
  }

  mandarImprimir() {
    if (!this.itensVenda.length) {
      console.warn('Tentou subir venda sem itens')
      return
    }

    const novaVenda = {
      valorSubtotal: this.resumoVenda.subtotal,
      valorDesconto: this.resumoVenda.desconto,
      valorTotal: this.resumoVenda.total,
      valorTroco: this.resumoVenda.troco,
      pagamento: this.resumoVenda.pagamentos.map(p => ({
        forma: p.forma,
        valorPago: p.valor
      })),
      produtosVenda: this.itensVenda.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        valorUnitario: item.valorVenda
      }))
    }

    console.log('Subindo Payload para impressora:', novaVenda)

    this.CaixaServices.mandarImprimir(novaVenda).subscribe({
      next: (res) => {
        console.log('Subindo para impressora', res)
      },
      error: (err) => {
        console.error('Erro ao imprimir cupom', err)
        if (err.error) console.error('Resposta do backend:', err.error)
      }
    })
  }

  @ViewChildren('itemVenda') linhas!: QueryList<ElementRef>

  controleSetinhasItensVendaExcluir(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.linhaFoco--
      this.focarLinha(this.linhaFoco)
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.linhaFoco++
      this.focarLinha(this.linhaFoco)
    }

    if (event.key === 'Delete') {
      event.preventDefault()
      this.excluirItemVenda()
    }
  }

  excluirItemVenda() {
    if (this.itensVenda.length === 0) return

    this.itensVenda.splice(this.linhaFoco, 1)

    if (this.linhaFoco >= this.itensVenda.length) {
      this.linhaFoco = this.itensVenda.length - 1
    }

    this.atualizarResumo()
    this.ngAfterViewInit()
  }

  focarLinha(index: number) {
    const arr = this.linhas.toArray()
    if (arr[index]) {
      this.linhaFoco = index
      arr[index].nativeElement.focus()
    }
  }

  codigoBarras() {
    const codigoBarras = String(this.termoPesquisa).trim().toLowerCase()
    this.buscarProdutosEstoquePorCodigoBarras(codigoBarras)
    clearTimeout(this.searchTimeout)
    console.log(this.itensVenda)
    this.termoPesquisa = ''
    this.itensDropDown = []
    this.indexAtivo = 0
    this.atualizarResumo()
    this.ngAfterViewInit()

  }

  selecionarItem(item: any, index: number) {
    this.indexAtivo = index
    this.adicionarItem(item)
  }

  adicionarItem(item: any) {
    this.itensVenda.push({ ...item, quantidade: 1 })
    this.atualizarResumo()
    this.termoPesquisa = ''
    this.itensDropDown = []
    this.indexAtivo = 0
  }

  atualizarQuantidade(item: any, event: Event, viaEnter = false) {
    const el = event.target as HTMLElement
    const valor = el.innerText.trim()

    item.quantidade = valor ? Number(valor) : 0

    this.atualizarResumo()

    if (viaEnter) {
      event.preventDefault()
      this.ngAfterViewInit()
    }
  }

  cancelarVenda() {
    this.itensVenda = []
    this.atualizarResumo()
    this.resumoVenda.pagamentos = []
  }

  modalAberto = 0
  valorPago = 0

  constructor(private CaixaServices: CaixaServices) { }

  valorFaltante() {
    const totalPagamentos = this.resumoVenda.pagamentos
      .reduce((soma, p) => soma + (p.valor || 0), 0)
    return this.resumoVenda.total - totalPagamentos
  }

  @HostListener('window:keydown', ['$event'])
  teclaPressionada(event: KeyboardEvent) {
    if (event.key === 'F1' || event.key === 'F2' || event.key === 'F3' || event.key === 'F4' || event.key === 'F5' || event.key === 'F6' || event.key === 'F7' || event.key === 'F8' || event.key === 'F9' || event.key === 'F10' || event.key === 'F13' || event.key === 'Tab') {
      event.preventDefault()
    }

    switch (this.modalAberto) {
      case 0:
        const tecla = event.key
        if (tecla.length === 1 && /[0-9]/.test(tecla) || tecla.length === 1 && /[a-zA-Z]/.test(tecla)) {
          this.ngAfterViewInit()
        }
        if (event.key === 'F1') {
          if (this.itensVenda.length > 0) {
            this.modalAberto = 1
          }
          else {
            alert("Nenhum Item Cadastrado!")
            this.ngAfterViewInit()
          }
        }
        if (event.key === 'F2') this.modalAberto = 2
        if (event.key === 'F3') this.foco()
        if (event.key === 'F4') this.focarLinha(this.itensVenda.length - 1)
        if (event.key === 'F11') this.ngAfterViewInit()
        break
      case 1:
        this.tirarFoco()
        if (event.key === '1') {
          this.modalAberto = 3
          setTimeout(() => {
            const el = this.inputValor.nativeElement
            el.focus()
            el.setSelectionRange(0, el.value.length)
          }, 0)
        }
        if (event.key === '2') {
          this.modalAberto = 4
          this.resumoVenda.pagamentos = [
            { forma: 'Pix', valor: this.resumoVenda.total }
          ]
        }
        if (event.key === '3') {
          this.modalAberto = 4
          this.resumoVenda.pagamentos = [
            { forma: 'Cartão de Crédito', valor: this.resumoVenda.total }
          ]
        }
        if (event.key === '4') {
          this.modalAberto = 4
          this.resumoVenda.pagamentos = [
            { forma: 'Cartão de Débito', valor: this.resumoVenda.total }
          ]
        }
        if (event.key === '5') {
          this.modalAberto = 5
        }
        if (event.key === 'Escape') {
          this.modalAberto = 0
          this.ngAfterViewInit()
        }
        break
      case 2:
        if (event.key === 'F1') {
          this.modalAberto = 0
          this.cancelarVenda()
          this.ngAfterViewInit()
        }
        if (event.key === 'Escape') this.modalAberto = 0
        break
      case 3:
        if (event.key === 'F1') {
          if (this.valorPago >= this.resumoVenda.total) {
            this.resumoVenda.pagamentos = [
              { forma: 'Dinheiro', valor: this.valorPago }
            ]
            this.atualizarResumo()
            this.modalAberto = 4
          }
          else {
            alert("Valor Inesperado!")
          }
        }
        if (event.key === 'Escape') this.modalAberto = 1
        break
      case 4:
        if (event.key === 'F1') {
          this.atualizarResumo()
          this.subirVenda()
          this.cancelarVenda()
          this.modalAberto = 0
          this.ngAfterViewInit()
        }
        if (event.key === 'F2') {
          this.atualizarResumo()
          this.subirVenda()
          this.mandarImprimir()
          this.cancelarVenda()
          this.modalAberto = 0
          this.ngAfterViewInit()
        }
        if (event.key === 'Escape') {
          this.modalAberto = 1
        }
        break
      case 5:
        if (event.key === '1') {
          this.modalAberto = 6
          this.resumoVenda.pagamentos = [
            { forma: 'Dinheiro', valor: this.valorPago }
          ]

        }
        if (event.key === 'Escape') {
          this.modalAberto = 1
        }
        break
    }
  }
}
