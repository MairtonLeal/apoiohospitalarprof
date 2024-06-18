import { ChatAtendimentoPage } from './../chat-atendimento/chat-atendimento.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalController, AlertController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import * as moment from 'moment';
import { Keys } from '../core/Keys';
import { OnSignalAdminService } from '../services/onsignalAdmin.service';
import { ServiceDetailPage } from '../service-detail/service-detail.page';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  // dateToday = moment().locale('pt-br').format('DD/MM/YYYY - HH:mm');
  dateToday = moment().locale('pt-br').format('HH:mm');
  dataHistorico = moment().locale('pt-br').format('DDMMYYHHmm');

  carregando: any;
  meuServico: any;
  servicos: any;
  usuarioId: any;
  foto: any;
  nome: any;
  usuario: any;
  idoso: any;
  idosoServico: any;
  profissionalServico: any;
  meuPlano: any;
  mostrarConfirmacao = false;
  convites: any;
  conveniados: any;

  atendimentos: any;
  infoVazia !: boolean;
  idosoUser: any;
  estadias: any;
  

  constructor(
    private fbstore: AngularFirestore,
    public modalController: ModalController,
    public toastService: ToastService,
    public alertController: AlertController,
    private oneSignalAdmin: OnSignalAdminService,
  ) {
    // console.log(this.dataHistorico);
  
  }

  ionViewWillEnter() {
    this.usuarioId = localStorage.getItem(Keys.userProf);
    // this.getAtendimentos();
    // this.getServicos();
    this.getEstadia();
 
  }

  // codigo para atualizar paginas
  async atualizarPagina() {
    this.carregando = true;
    setTimeout(() => {
      // this.getAtendimentos();
      this.getEstadia();
      this.carregando = false;
    }, 2000);
  }


  // Traz dados do idoso
  // Firestore pegando por id
  getIdosoById(idosoId: any) {
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



  async cancelarComMotivo(id: any) {
    const alert = await this.alertController.create({
      header: 'Deseja cancelar atendimento ?',
      message: 'Após confirmação realizada, é necessario informar o motivo.',
      mode: 'ios',
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
        status: 'Arquivado',
        motivoCancelamento: motivo,
      })
      .then(() => {
        this.toastService.showToast('Atendimento aceito !', 1000, 'success');
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

  async chatAtendimento(id: any) {
    const modal = await this.modalController.create({
      component: ChatAtendimentoPage,
      cssClass: 'modal-atendimento',
      componentProps: {
        atendimentoId: id,
      },
    });

    // codigo para atualizar paginas ao fechar modal
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        
      }
    });
    return await modal.present();
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
                  beneficio: lista.payload.doc.data().beneficio,
                  fotoCliente: lista.payload.doc.data().fotoCliente
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


 async atualizarEstadia(id: any, status: any, idClient: any) {
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
                statusAtendimento: status,
              })
              .then(() => {
                this.toastService.showToast('Atendimento aceito !', 1000, 'success');
                this.oneSignalAdmin.sendMessage(
                  ` Atendimento confirmado`,
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
