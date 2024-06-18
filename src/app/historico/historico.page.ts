import { Component } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Keys } from '../core/Keys';
import { ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage {

  carregando: any;
  meuServico: any;
  servicos: any;
  minhasFaturas:any;
  minhaFatura: any;
  usuarioId: any;
  foto: any;
  nome: any;
  usuario: any;
  idoso: any;
  idosoServico: any;
  profissionalServico: any;
  historicoAtendimentos: any;
  tipoItem = 'atendimentos';
  estadias: any;

  constructor(
    private fbstore: AngularFirestore,
    public actionSheetController: ActionSheetController
  ) {}

  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userProf);
    this.getServicos();
    // this.getFaturas();
    this.getHistoricoAtendimentos();
  }

  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
      // this.getServicos();
      this.getEstadias();
      this.carregando = false;
    }, 2000);
  }

  getServicos() {
    this.carregando = true;
    // Traz dados do serviço
    this.fbstore
      .collection(`Servico`, (ref) =>
        ref.where('historico', '==', true)
        // ref.orderBy('criadoEm', 'asc')
      )
      .snapshotChanges()
      .subscribe((data: any) => {
        this.servicos = data.map((listaServicos: any) => {
          this.meuServico = listaServicos.payload.doc.data();
          this.carregando = false;
          if (
            listaServicos.payload.doc.data().idProfissional ===
              this.usuarioId &&
            listaServicos.payload.doc.data().historico === true
          ) {
            // console.log(this.meuServico);
            this.getIdosoById(listaServicos.payload.doc.data().idCliente);
            return {
              idCliente: listaServicos.payload.doc.data().idCliente,
              idProfissional: listaServicos.payload.doc.data().idProfissional,
              dataHora: listaServicos.payload.doc.data().dataEHora,
              procedimento: listaServicos.payload.doc.data().tipoServico,
              nome: listaServicos.payload.doc.data().nomeProfissional,
              foto: listaServicos.payload.doc.data().fotoProfissional,
              profissao: listaServicos.payload.doc.data().profissao,
              status: listaServicos.payload.doc.data().status,
              formaPagamento: listaServicos.payload.doc.data().formaPagamento,
              valor: listaServicos.payload.doc.data().valorServico,
              endereco: listaServicos.payload.doc.data().endereco,
              historico: listaServicos.payload.doc.data().historico,
            };
          } else {
            return null;
          }
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }

  getIdosoById(idosoId: any) {
    // Firestore pegando por id
    this.fbstore
      .collection('Idosos')
      .doc(idosoId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.idosoServico = singleDoc;
        // console.log(this.idosoServico);
      });
  }

  async getUsuario() {
    // Firestore pegando por id
    this.fbstore
      .collection('Profissionais')
      .doc(this.usuarioId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.profissionalServico = singleDoc;
      });
  }

  async carregar() {
    if (this.tipoItem === 'historico') {
      this.getServicos();
    }
  }

  async getFaturas() {
    this.fbstore
      .collection(`Faturas`, (ref) =>
      ref.orderBy('criadoEm', 'asc')
      // ref.where('historico', '==', true)
      )
      .snapshotChanges()
      .subscribe((data: any) => {
        this.minhasFaturas = data.map((fatura: any) => {
          this.carregando = false;
          // if(this.usuarioId === listaServicos.payload.doc.data().sP) {
          let vencimento = moment(fatura.payload.doc.data().realizadoEm)
            .add(7, 'days')
            .locale('pt-br')
            .format('DD/MM/YYYY');
          if (fatura.payload.doc.data().idProfissional === this.usuarioId) {
            // console.log(fatura.payload.doc.data());
            return {
              faturaVencimento: fatura.payload.doc.data().vencimento,
              faturaServico: fatura.payload.doc.data().tipoAtendimento,
              faturaCuidado: fatura.payload.doc.data().cuidado,
              status: fatura.payload.doc.data().status,
              valor: fatura.payload.doc.data().valorFatura,
              vencimento: vencimento,
            };
          } else {
            return null;
          }
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }

  async getHistoricoAtendimentos() {
    this.fbstore
      .collection(`Historico`)
      .snapshotChanges()
      .subscribe((data: any) => {
        this.historicoAtendimentos = data.map((lista: any) => {
          this.carregando = false;
          // console.log(lista.payload.doc.data());
          if (
            lista.payload.doc.data().servico.idProfissional === this.usuarioId
          ) {
            return {
              id: lista.payload.doc.id,
              status: lista.payload.doc.data().status,
              dataEHora: lista.payload.doc.data().servico.dataHora,
              hora: lista.payload.doc.data().servico.hora,
              cuidado: lista.payload.doc.data().servico.cuidadoAss,
              tipo: lista.payload.doc.data().servico.tipo,
              obs: lista.payload.doc.data().servico.obs,
              valor: lista.payload.doc.data().servico.valorCuidado,
              endereco: lista.payload.doc.data().servico.endereco,
              foto: lista.payload.doc.data().servico.fotoProfissional,            };
          } else {
            return null;
          }
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }



  getEstadias() {
    this.carregando = true;
    this.fbstore
      .collection(`Estadia`, (ref: any) => ref.where('idProfissional', '==', this.usuarioId))
      .snapshotChanges()
      .subscribe((data: any) => {
        this.estadias = data.map((lista: any) => {
          this.carregando = false;
            console.log(lista.payload.doc.data())
          return {
            id: lista.payload.doc.id,
            idProf: lista.payload.doc.data().idProfissional,
            dataHora: lista.payload.doc.data().dataHora,
            profissao: lista.payload.doc.data().profissao,
            profissional: lista.payload.doc.data().profissional,
            endereco:lista.payload.doc.data().endereco,
            status: lista.payload.doc.data().statusEstadia,
            foto: lista.payload.doc.data().fotoProfissional,
            valor: lista.payload.doc.data().valorTotal,
            estadia: lista.payload.doc.data().estadia,
            informacoes: lista.payload.doc.data().informacoes,
            nomeHospital: lista.payload.doc.data().nomeHospital,
            pontoDeEncontro: lista.payload.doc.data().pontoDeEncontro,
          };
       
        });
        of(data)
          .pipe(delay(1500))
          .subscribe(() => {
            this.carregando = false;
          });
      });
  }




}
