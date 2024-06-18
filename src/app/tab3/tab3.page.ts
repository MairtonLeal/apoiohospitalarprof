import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Keys } from '../core/Keys';
import { ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  carregando: any;
  meuServico: any;
  servicos: any;
  minhasFaturas: any;
  minhaFatura: any;
  usuarioId: any;
  foto: any;
  nome: any;
  usuario: any;
  idoso: any;
  idosoServico: any;
  profissionalServico: any;

  tipoItem = 'pagamentos';
  constructor(
    private fbstore: AngularFirestore,
    public actionSheetController: ActionSheetController
  ) {}

  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userProf);
  }

  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
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

}


