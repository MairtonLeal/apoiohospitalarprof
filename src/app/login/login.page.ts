import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { Keys } from '../core/Keys';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import OneSignal from 'onesignal-cordova-plugin';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonRouterOutlet, { static : true }) routerOutlet !: IonRouterOutlet;

  loginForm = new FormGroup({
    useremail: new FormControl('', [Validators.required, Validators.email]),
    userpass: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  button = false;
  mostrarSenha = true;

  idSendUser: any;
  constructor(
    public router: Router,
    private fbauth: AngularFireAuth,
    private fbstore: AngularFirestore,
    private toastservice: ToastService,
    private navController: NavController,
    private platform: Platform,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
    });

  }
  ionViewWillEnter() {
    if (localStorage.getItem(Keys.userProf) !== null) {
      this.navController.navigateRoot(['/tabs/tab1']);
    }
    this.idSendUser = localStorage.getItem(Keys.playerIdProf);
  }

  ngOnInit() {}

  async doLogin() {
    try {
      this.button = true;
      let email = this.loginForm.get('useremail')?.value as string;
      let senha = this.loginForm.get('userpass')?.value as string
      await this.fbauth
        .signInWithEmailAndPassword(
          email, senha
        )
        .then((data: any) => {
          // data.user.getIdToken().then((token) => {
          //   localStorage.setItem(Keys.user, JSON.stringify(data.user)); // salvar o usuario no localstorage
          // });
          // salvar o usuario no localstorage
          localStorage.setItem(Keys.userProf, data.user.uid); // salvar o token no localstorage
          if(!this.idSendUser) { 
            this.fbstore
            .collection('Profissionais')
            .doc(data.user.uid)
            .update({
              playerId: this.idSendUser,
            })
            .then(() => {
              localStorage.setItem(Keys.userProf, data.user.uid);
            }).catch((() => {console.log("erro ao atualizar notificacao")}))

          } else {
           OneSignal.getDeviceState((resp) => {
              this.idSendUser = localStorage.setItem(Keys.playerIdProf, resp.userId);
            });
              // Firestore pegando por id
              this.fbstore
                .collection('Profissionais')
                .doc(data.user.uid)
                .valueChanges()
                .subscribe((singleDoc:any) => {             
                  localStorage.setItem(Keys.playerIdProf, singleDoc.playerIdProf);
                });
          }
          // this.router.navigate(['/tabs/tab1']);
          this.navController.navigateRoot(['/tabs/tab1']);
          this.button = false;
        });
      
    } catch (error: any) {
      this.button = false;
      switch (error.code) {
        case 'auth/wrong-password':
          this.toastservice.showToast(
            'Usuário ou senha está incorreta',
            2000,
            'danger'
          );
          
          break;
        case 'auth/user-not-found':
          this.button = false;
          this.toastservice.showToast(
            'Usuario não encontrado ou não existe',
            2000,
            'danger'
          );
          break;
        case 'auth/network-request-failed':
          this.button = false;
          this.toastservice.showToast(
            'Verifique sua conexão internet',
            2000,
            'danger'
          );
          break;
        default:
          this.toastservice.showToast(
            'Ocorreu um erro tente novamente',
            2000,
            'danger'
          );
      }
    }
  }

  async reset() {
    await this.router.navigate(['/esqueci-senha']);
  }
}
