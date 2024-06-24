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
    this.getEstadias();
  
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
      this.getEstadias();
    }
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
