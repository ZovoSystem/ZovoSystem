import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit, OnDestroy {

  dataHoraAtual: string = ''
  private intervalId: any

  ngOnInit() {
    this.atualizarDataHora()
    this.intervalId = setInterval(() => this.atualizarDataHora(), 1000)
  }

  ngOnDestroy() {
    clearInterval(this.intervalId)
  }

  atualizarDataHora() {
    const agora = new Date()

    const dia = String(agora.getDate()).padStart(2, '0')
    const mes = String(agora.getMonth() + 1).padStart(2, '0') // mês começa em 0
    const ano = agora.getFullYear()

    const horas = String(agora.getHours()).padStart(2, '0')
    const minutos = String(agora.getMinutes()).padStart(2, '0')
    const segundos = String(agora.getSeconds()).padStart(2, '0')

    this.dataHoraAtual = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`
  }

  openCloseBar() {

    const tps = document.querySelectorAll<HTMLElement>('.tp')
    const leftBar = document.querySelectorAll<HTMLElement>('.left-bar')

    leftBar.forEach(left => {
      left.classList.toggle('open')
    })

    tps.forEach(tp => {
      tp.classList.toggle('d-none')
    })
  }
}
