import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Component } from '@angular/core';
import {
  AlertController,
  ToastController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import * as moment from 'moment';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import { OnSignalAdminService } from '../services/onsignalAdmin.service';
import { Keys } from '../core/Keys';
import { ServiceDetailPage } from '../service-detail/service-detail.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  confirmado: boolean = true;
  dateToday = moment().locale('pt-br').format('D MMMM, YYYY.');
  carregando: any;
  meuServico: any;
  servicos: any;
  foto: any;
  nome: any;
  usuarioId: any;
  usuario: any;
  idoso: any;
  expandedIcon = true;
  expandedService = false;
  mostrarConfirmacao = false;
  idosoServico: any;
  profissionalServico: any;
  idosoUser: any;
  infoVazia: any;
  atendimentos: any;
  estadias: any;
  dataHistorico = moment().locale('pt-br').format('DDMMYYHHmm');
  hideTitle = false;

  servicosProf = [
    {
      id: 1,
      servico: 'Aferição Pressão e glicose',
      descricao: 'Avaliar pressão e glicose no sangue',
    },
    {
      id: 2,
      servico: 'Limpezas e Curativo',
      descricao: 'Aplicar, trocar e remoção de feridas',
    },
    {
      id: 3,
      servico: 'Soroterapia e Injétaveis',
      descricao: 'Aplicar e medicamentos',
    },
    {
      id: 4,
      servico: 'Cuidados de higiene',
      descricao: 'Limpezas, troca de fralda...',
    },
    {
      id: 5,
      servico: 'Acomp. em Transporte(Ida&Volta)',
      descricao: 'Passeios, Consultas médicas...',
    },
    {
      id: 6,
      servico: 'Atividades recreativas(Ida&Volta)',
      descricao: 'Hidroginastica, fisioterapia etc.',
    },
  ];


  acompanhamentosProf = [
    {
      id: 1,
      servico: 'Acomp. Noite',
      value: 'Acompanhamento Noite',
      descricao: 'Estadias em hospitais e internações',
      tipo: 'Hospitalar'
    },
    {
      id: 2,
      servico: 'Acomp. Madrugada',
      value: 'Acompanhamento Madrugada',
      descricao: 'Estadias em hospitais e internações',
      tipo: 'Hospitalar'
    },
    {
      id: 3,
      servico: 'Acomp. Manha',
      value: 'Acompanhamento Manha',
      descricao: 'Estadias em hospitais e internações',
      tipo: 'Hospitalar'
    },
    {
      id: 4,
      servico: 'Acomp. Tarde',
      value: 'Acompanhamento Tarde',
      descricao: 'Estadias em hospitais e internações',
      tipo: 'Hospitalar'
    },
    {
      id: 5,
      servico: 'Soroterapia',
      value: 'Soroterapia',
      descricao: 'Acompanhamento no tratamento no hospital',
      tipo: 'Hospitalar'
    },
    {
      id: 6,
      servico: 'Cuidado e Higiente prolongado',
      value: 'Cuidado e Higiente prolongado',
      descricao: 'Banhos e troca de fraldas em hospitais',
      tipo: 'Hospitalar'
    },
    {
      id: 7,
      servico: 'Acomp. extra-residencial',
      value: 'Acompanhamento extra-residencial',
      descricao: 'Viagens para atendimento.',
      tipo: 'HomeCare'
    },

    {
      id: 8,
      servico: 'Acomp. intra-residencial',
      value: 'Acompanhamento intra-residencial',
      descricao: 'Auxilio residencial básico',
      tipo: 'HomeCare'
    },
    {
      id: 9,
      servico: 'Acomp. Atividade Fisica',
      value: 'Acompanhamento Atividade Fisica',
      descricao: 'Para hidroginastica, fisioterapia e necessidades.',
      tipo: 'HomeCare'
    },
    {
      id: 10,
      servico: 'Cuidado e Higiente prolongado',
      value: 'Cuidado e Higiente prolongado',
      descricao: 'Banhos e troca de fraldas domicilio',
      tipo: 'HomeCare'
    },


  ];




  constructor(
    public alertController: AlertController,
    public toastService: ToastService,
    private fbauth: AngularFireAuth,
    private fbstore: AngularFirestore,
    public modalController: ModalController,
    private oneSignalAdmin: OnSignalAdminService,
    private actionSheetController: ActionSheetController
  ) { }

  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userProf);
    this.getUsuario();
    this.getEstadia();
    // this.getSolicitacoes();
    // this.getAtendimentos();
  }

  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {

      this.getUsuario();
      this.getEstadia();
      this.carregando = false;
    }, 2000);
  }


  getIdosoById(idosoId: any) {
    // Traz dados do idoso
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
    //  Função para pegar dados diretamente do auth do usuário
    this.fbauth.authState.subscribe((data) => {
      if (data && data.email && data.uid) {
        this.nome = data.displayName;
      }
    });
    // Firestore pegando por id
    this.fbstore
      .collection('Profissionais')
      .doc(this.usuarioId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.profissionalServico = singleDoc;
      });
  }

  async cancelarComMotivo(id: any) {
    const alert = await this.alertController.create({
      header: 'Deseja cancelar atendimento ?',
      message: 'Após confirmação realizada, é necessario informar o motivo.',
      inputs: [
        {
          name: 'motivo',
          type: 'text',
          placeholder: 'Motivo do cancelamento',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          cssClass: 'primary',
          handler: (data) => {
            this.salvarHistorico(id, data.motivo);
            // .catch((error) => console.log(error));
          },
        },
      ],
    });

    await alert.present();
  }

  async salvarHistorico(id: any, motivo: any) {
    this.fbstore
      .doc(`Atendimento/${id}`)
      .update({
        statusAtendimento: 'Arquivado',
        motivoCancelamento: motivo,
      })
      .then(() => {
        this.toastService.showToast(
          'Cancelamento realizado com sucesso',
          1000,
          'success'
        );
      })
      .catch((error) => {
        console.log(error);
        this.toastService.showToast(
          'Erro ao aceitar Atendimento',
          1000,
          'danger'
        );
      });
  }

  async getEstadia() {
    const refAtendimento = this.fbstore.collection(`Estadia`, (ref) =>
      ref.where('idProfissional', '==', this.usuarioId)
    );
    refAtendimento.get().subscribe((data) => {
      if (data.empty) {
        this.infoVazia = true;
      } else {
        this.infoVazia = false;
        this.fbstore
          .collection(`Estadia`)
          .snapshotChanges()
          .subscribe((data: any) => {
            this.estadias = data.map((lista: any) => {
              this.carregando = false;
              if (lista.payload.doc.data().idProfissional === this.usuarioId) {
                this.getIdosoById(lista.payload.doc.data().idCliente);
                console.log(lista.payload.doc.data());
                return {
                  id: lista.payload.doc.id,
                  idCliente: lista.payload.doc.data().idCliente,
                  idProfissional: lista.payload.doc.data().idProfissional,
                  dataHora: lista.payload.doc.data().dataHora,
                  cuidado: lista.payload.doc.data().cuidadoAss,
                  endereco: lista.payload.doc.data().endereco,
                  status: lista.payload.doc.data().statusEstadia,
                  foto: lista.payload.doc.data().fotoProfissional,
                  valorTotal: lista.payload.doc.data().valorTotal,
                  estadia: lista.payload.doc.data().estadia,
                  informacoes: lista.payload.doc.data().informacoes,
                  nomeHospital: lista.payload.doc.data().nomeHospital,
                  playerIdCliente: lista.payload.doc.data().playerIdCliente,
                  beneficio: lista.payload.doc.data().beneficio
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
    });
  }


  async aceitarEstadia(id: any, status: any, idClient: any) {
    status = 'Confirmado';

    const alert = await this.alertController.create({
      header: 'Deseja confirmar o Atendimento ?',
      message: 'Ao confirmar, notificaremos o status do seu cliente do aceite do atendimento',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service',
        },
        {
          text: 'Confirmar serviço',
          cssClass: 'confirm-button-service',
          handler: () => {
            this.fbstore
              .doc(`Estadia/${id}`)
              .update({
                statusEstadia: status,
              })
              .then(() => {
                this.toastService.showToast('Atendimento aceito !', 1000, 'success');
                this.oneSignalAdmin.sendMessage(
                  `Atendimento confirmado`,
                  `Atendimento Confirmado, Verifique em Meus atendimentos`,
                  idClient
                );
                this.getEstadia();
              })
              .catch((error) => {
                console.log(error);
                this.toastService.showToast(
                  'Erro ao aceitar Atendimento',
                  1000,
                  'danger'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }


  async detalhesEstadia(id: any) {
    const modal = await this.modalController.create({
      component: ServiceDetailPage,
      cssClass: 'modal-atendimento',
      componentProps: {
        estadiaId: id,
      },
    });
    return await modal.present();
  }


}
