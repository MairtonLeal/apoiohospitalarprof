import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastService } from './../services/toast.service';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { OnSignalAdminService } from '../services/onsignalAdmin.service';
import { Keys } from '../core/Keys';
import * as moment from 'moment';
import { ChatAtendimentoPage } from '../chat-atendimento/chat-atendimento.page';
import { AlertService } from '../core/services/alertService';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit {
  public estadiaId = this.navParams.get('estadiaId');
  estadiaDados: any;
  usuarioId: any;
  dataHistorico = moment().locale('pt-br').format('DDMMYYHHmm');
  dateToday = moment().locale('pt-br').format('D MMMM, YYYY.');
  idoso: any;

  constructor(
    private navParams: NavParams,
    private fbstore: AngularFirestore,
    public modalController: ModalController,
    private toastController: ToastService,
    public alertController: AlertController,
    private oneSignalAdmin: OnSignalAdminService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.usuarioId = localStorage.getItem(Keys.userProf);
    this.getAtendimento();
  }

  async getAtendimento() {
    this.fbstore
      .collection('Estadia')
      .doc(this.estadiaId)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.estadiaDados = singleDoc;
        this.getIdosoById(this.estadiaDados.idCliente);
        // console.log(this.atendimentoDados);
        // this.getProfissional(this.atendimentoDados.idSP);
      });
  }

  async getIdosoById(id: any) {
    await this.fbstore
      .collection('Idosos')
      .doc(id)
      .valueChanges()
      .subscribe((singleDoc) => {
        this.idoso = singleDoc;
        // console.log(this.idoso);
      });
  }

  async fechar() {
    this.modalController.dismiss();
  }


  async atualizarEstadia(type: string, estadiaSelecionada: any) {

    if (type === 'ConfirmarEstadia') {
      const alert = await this.alertController.create({
        header: 'Deseja confirmar a estadia ?',
        message: 'Ao confirmar, notificaremos o status do seu cliente do aceite do aceite',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'cancel-button-service',
          },
          {
            text: 'Confirmar',
            cssClass: 'confirm-button-service',
            handler: () => {
              this.fbstore
                .doc(`Estadia/${this.estadiaId}`)
                .update({
                  statusEstadia: 'Confirmado',
                })
                .then(() => {
                  this.fechar();
                  this.toastController.showToast('Estadia aceita !', 1000, 'success');
                  this.oneSignalAdmin.sendMessage(
                    ` Estadia confirmada`,
                    `Estadia Confirmada, Verifique Em atendimento`,
                    estadiaSelecionada.playerIdCliente
                  );
                })
                .catch((error) => {
                  console.log(error);
                  this.fechar();
                  this.toastController.showToast(
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
    } else if (type === 'IrParaEstadia'){
      const alert = await this.alertController.create({
        header: 'Confirmar partida para estadia ?',
        message: 'Ao confirmar, notificaremos o status do seu cliente do deslocamento para estadia.',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'cancel-button-service',
          },
          {
            text: 'Confirmar',
            cssClass: 'confirm-button-service',
            handler: () => {
              this.fbstore
                .doc(`Estadia/${this.estadiaId}`)
                .update({
                  statusEstadia: 'Iniciar_Estadia',
                })
                .then(() => {
                  this.fechar();
                  this.toastController.showToast('Estadia aceita !', 1000, 'success');
                  this.oneSignalAdmin.sendMessage(
                    ` Estadia Iniciada`,
                    `Estadia Iniciada, Verifique Em atendimento`,
                    estadiaSelecionada.playerIdCliente
                  );
                })
                .catch((error) => {
                  console.log(error);
                  this.fechar();
                  this.toastController.showToast(
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

    else if (type === 'IniciarEstadia'){
      const alert = await this.alertController.create({
        header: 'Confirmar partida para estadia ?',
        message: 'Ao confirmar, notificaremos o status do seu cliente do deslocamento para estadia.',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'cancel-button-service',
          },
          {
            text: 'Confirmar',
            cssClass: 'confirm-button-service',
            handler: () => {
              this.fbstore
                .doc(`Estadia/${this.estadiaId}`)
                .update({
                  statusEstadia: 'Em_Estadia',
                })
                .then(() => {
                  this.fechar();
                  this.toastController.showToast('Estadia aceita !', 1000, 'success');
                  this.oneSignalAdmin.sendMessage(
                    ` Estadia Em andamento`,
                    `Estadia Em andamento, Verifique Em atendimento`,
                    estadiaSelecionada.playerIdCliente
                  );
                })
                .catch((error) => {
                  console.log(error);
                  this.fechar();
                  this.toastController.showToast(
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

    else if (type === 'FinalizarEstadia') {

      this.alertService.alertCancelWithFunction(
        "Confirmar Finalização do serviço?", "", "Esta ação irá encerrar sua estadia", "Finalizar", () => {
          this.fbstore
            .doc(`Estadia/${this.estadiaId}`)
            .update({
              statusEstadia: 'Concluido',
            })
            .then(() => {
              this.fechar();
              this.toastController.showToast('Estadia Finalizada !', 1000, 'success');
              this.oneSignalAdmin.sendMessage(
                ` Estadia Finalizada`,
                `Estadia Finalizada !`,
                estadiaSelecionada.playerIdCliente
              );
              let historicoId = this.dataHistorico + this.usuarioId;
              this.fbstore
                .doc(`Historico/${historicoId}`)
                .set({
                  dadosDaEstadia: estadiaSelecionada,
                  statusEstadia: 'Concluido',
                  dataCancelamento: this.dateToday,
                })
                .catch((error) => {
                  this.fechar();
                });
            });
        }
      )


    }

  }



  async cancelarComMotivo(atendimentoSelecionado: any) {
    let status = 'Cancelado';
    let estadiaDados = atendimentoSelecionado;

    const alert = await this.alertController.create({
      cssClass: 'alert-modal',
      header: 'Deseja cancelar?',
      message: 'Informe seu motivo para o cancelamento.',
      inputs: [
        {
          name: 'motivo',
          type: 'textarea',
          placeholder: 'Descreva o motivo',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button-service',
          handler: () => {
            this.fechar();
          },
        },
        {
          text: 'Confirmar',
          cssClass: 'confirm-button-service',
          handler: () => {
            //  deletar atendimento e salvar no historico
            this.fbstore
              .doc(`Estadia/${this.estadiaId}`)
              .update({
                statusEstadia: 'Cancelado',
              }).then(() => {
                this.toastController.showToast(
                  'Sua Estadia foi cancelada!',
                  1000,
                  'success'
                );
                this.oneSignalAdmin.sendMessage(
                  'Estadia Cancelado',
                  `Sentimos muito, seu serviço foi cancelado`,
                  this.idoso.playerId
                );
               
              })
              .catch((error) => {
                this.fechar();
                console.log(error)

              });


          },
        },
      ],
    });

    await alert.present();
  }



  async chatAtendimento() {
    this.fechar();
    const modal = await this.modalController.create({
      component: ChatAtendimentoPage,
      cssClass: 'modal-atendimento',
      componentProps: {
        atendimentoId: this.estadiaId,
      },
    });

    return await modal.present();
  }

}
