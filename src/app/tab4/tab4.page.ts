import { Keys } from './../core/Keys';
import { Router, NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public slideOpt = {
    slidesPerView: 2.8,
  };
  dateToday = moment().locale('pt-br').format('D MMMM, YYYY.');
  phoneNumber = '';
  email = '';
  nome: any;
  foto: any;
  usuario: any;
  usuarioId: any;
  meuPerfil: any;
  meuId: any;
  constructor(
    private fbauth: AngularFireAuth,
    public router: Router,
    private fbstore: AngularFirestore
  ) {}

  ngOnInit() {
    this.getUsuario();
    this.usuarioId = localStorage.getItem(Keys.userProf);
  }

  async sair() {
    await this.fbauth
      .signOut()
      .then(() => {
        localStorage.removeItem(Keys.userProf);
        localStorage.removeItem(Keys.token);
        localStorage.removeItem(Keys.playerIdProf);
        localStorage.clear();
        this.router.navigate(['/login']);
      })
      .catch((error) => console.log(error));
  }

  async getProfile() {
    //  Função para pegar dados diretamente do auth do usuário
    this.fbauth.authState.subscribe((data) => {
      if (data && data.email && data.uid) {
        this.email = data.email;
        this.nome = data.displayName;
      } else {
        console.log('Não foi possível autenticar.');
      }
    });
  }

  async getUsuario() {
    //  Função para pegar dados diretamente do auth do usuário
    this.fbauth.authState.subscribe((data) => {
      if (data && data.email && data.uid) {
        this.email = data.email;
        this.nome = data.displayName;
        // this.foto = data.photoURL;
      } else {
        console.log('Não foi possível autenticar.');
      }
    });

    this.fbstore
      .collection(`Profissionais`)
      .snapshotChanges()
      .subscribe((data: any) => {
        this.usuario = data.map((meusDados: any) => {
          if (this.usuarioId === meusDados.payload.doc.id) {
            this.meuPerfil = meusDados.payload.doc.data();
            this.meuId = meusDados.payload.doc.id;
            this.foto = meusDados.payload.doc.data().fotoPerfil;
            return {
              id: meusDados.payload.doc.id,
              email: meusDados.payload.doc.data()?.email,
              foto: meusDados.payload.doc.data()?.fotoPerfil,
              nome: meusDados.payload.doc.data()?.nomeUser,
              profissao: meusDados.payload.doc.data().profssao,
              telefone: meusDados.payload.doc.data().telefone,
              cpf: meusDados.payload.doc.data().cpfUser,
            };
          }
        });
      });
  }

  async atualizarDados() {
    let navigationExtras: NavigationExtras = {
      state: {
        perfilUsuario: this.meuPerfil,
        idPerfil: this.meuId,
      },
    };
    await this.router.navigate(['/profile-user'], navigationExtras);
  }


  async goToHistorico(){
    await this.router.navigate(['/historico']);
  }
}
