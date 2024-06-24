import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import { Keys } from '../core/Keys';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertService } from '../core/services/alertService';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  //#TODO AJUSTAR SLIDES
  // @ViewChild('slides') slides: IonSlides;
  termos = false;
  mostrarSenha = true;
  nameUser = '';
  nomeIdoso = '';
  age !: number;
  idadeIdoso!: number;
  telefone = '';
  button = false;
  uploadProgress !: Observable<number>;
  verFoto = '';
  exibirFoto: any;
  cpf: any;
  profissao: any;
  idDoc: any;
  idSendUser: any;
  chavePixEscolhida = '';
  chavePix = '';
  coren = '';
  corenUF = '';
  descricao = '';
  signupform = new FormGroup({
    useremail: new FormControl('', [Validators.required, Validators.email]),
    userpass: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    public router: Router,
    private fbstore: AngularFirestore,
    private toastservice: ToastService,
    private afStorage: AngularFireStorage,
    private fbauth: AngularFireAuth,
    private imagePicker: ImagePicker,
    private loadingController: LoadingController,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.idSendUser = localStorage.getItem(Keys.playerIdProf);

  }

  async finish() { }
  async doSignup() {
    if (this.signupform.get('useremail')?.value === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha os campo Email ',
        2000,
        'danger'
      );
    }
    if (this.signupform.get('userpass')?.value === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha o campo Senha',
        2000,
        'danger'
      );
    }
    if (this.nameUser === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha o campo Nome do responsável',
        2000,
        'danger'
      );
    }
    if (this.profissao === undefined) {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Selecione sua profissao',
        2000,
        'danger'
      );
    }

    // if (this.cpf === undefined) {
    //   this.toastservice.showToast(
    //     'Erro ao Cadastrar, Preencha o campo CPF',
    //     2000,
    //     'danger'
    //   );
    // }




    if (this.descricao === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preench sua descricao',
        2000,
        'danger'
      );
    }

    if (this.telefone === '') {
      this.toastservice.showToast(
        'Erro ao Cadastrar, Preencha o seu contato',
        2000,
        'danger'
      );
    } else {
      // metodo antigo
      // const novousuario = {
      //   spId: '',
      //   profissao: this.profissao,
      //   email: this.signupform.get('useremail').value,
      //   telefone: this.telefone,
      //   nomeUser: this.nameUser,
      //   cpfUser: this.cpf,
      //   fotoPerfil: this.verFoto,
      // };
      try {
        const email = this.signupform.get('useremail')?.value as string;
        const senha = this.signupform.get('userpass')?.value as string;
        this.button = true;
        if (this.verFoto) {
          await this.fbauth
            .createUserWithEmailAndPassword(email, senha)
            .then((data: any) => {
              data.user.updateProfile({
                displayName: this.nameUser,
              });
              // novousuario.spId = data.user.uid;
              this.idDoc = data.user.uid;
              // const randomId = Math.random().toString(36).substring(2);
              const ref = this.afStorage.ref(this.idDoc);
              const task = ref.put(
                this.dataURItoBlob(this.verFoto)
              );
              this.uploadProgress = task
                .snapshotChanges()
                .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
              task.then((res: any) => {
                ref
                  .getDownloadURL()
                  .toPromise()
                  .then((result: string) => {
                    this.verFoto = result;
                    this.fbstore
                      .collection('Profissionais')
                      .doc(this.idDoc)
                      .set({
                        profissao: this.profissao,
                        email: this.signupform.get('useremail')?.value,
                        telefone: this.telefone,
                        nomeUser: this.nameUser,
                        descricao: this.descricao,
                        fotoPerfil: this.verFoto,
                        playerId: this.idSendUser
                      })
                      .then(() => {
                        this.router.navigate(['/login']);
                        this.button = false;
                        this.alertService.showToastSuccess("Cadastro Realizado com sucesso");
                        // this.alertService.basicAlert("Cadastro enviado","Aguarde seu email", "Retornaremos um email para acesso assim que possivel")
                        // localStorage.setItem(Keys.token, this.idDoc);
                      });
                  });
              });
              // this.fbstore
              //   .collection('Profissionais')
              //   .add(novousuario)
              // .then((result) => {
              //   localStorage.setItem(Keys.token, result.id);
              //   console.log(result.id);
              // });


            });
        } else {
       
          await this.fbauth
            .createUserWithEmailAndPassword(email, senha)
            .then((data: any) => {
              data.user.updateProfile({
                displayName: this.nameUser,
              });
              // novousuario.spId = data.user.uid;
              this.idDoc = data.user.uid;
              this.fbstore
              .collection('Profissionais')
              .doc(this.idDoc)
              .set({
                profissao: this.profissao,
                email: this.signupform.get('useremail')?.value,
                telefone: this.telefone,
                nomeUser: this.nameUser,
                descricao: this.descricao,
                fotoPerfil:'',
                playerId: this.idSendUser
              })
              .then(() => {
                this.router.navigate(['/login']);
                this.button = false;
                this.alertService.showToastSuccess("Cadastro Realizado com sucesso");
                // this.alertService.basicAlert("Cadastro enviado","Aguarde seu email", "Retornaremos um email para acesso assim que possivel")
                // localStorage.setItem(Keys.token, this.idDoc);
              })
              .catch(() => {
                this.button = false;
                this.toastservice.showToast(
                  'Erro ao Cadastrar, tente novamente',
                  2000,
                  'danger'
                );
              })
            });
        }

      } catch (error: any) {
        this.button = false;
        switch (error.code) {
          case 'auth/invalid-email':
            this.toastservice.showToast('Email invalido', 2000, 'danger');
            break;
          default:
            this.toastservice.showToast(
              'Erro ao Cadastrar, tente novamente',
              2000,
              'danger'
            );
            console.log(error.message);
        }
      }
    }
  }

  fotoPerfil(): void {
    this.imagePicker
      .getPictures({
        quality: 100,
        maximumImagesCount: 1,
        title: 'Selecionar foto',
        outputType: 1, // base64
      })
      .then(
        (results) => {
          this.verFoto = 'data:image/png;base64,' + results[0];
          // const randomId = Math.random().toString(36).substring(2);
          // const ref = this.afStorage.ref(randomId);
          // const task = ref.put(
          //   this.dataURItoBlob('data:image/png;base64,' + results[0])
          // );
          // this.uploadProgress = task
          //   .snapshotChanges()
          //   .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
          // task.then((res: any) => {
          //   ref
          //     .getDownloadURL()
          //     .toPromise()
          //     .then((result: string) => {
          //       // this.cliente.usuario.foto = result;
          //       this.verFoto = result;
          //       // this.uploadProgress = null;
          //       // this.atualizado().then();
          //     });
          // });
        },
        (err) => {
          // alert('Camera não habilitada');
          this.toastservice.showToast(
            'Erro ao tirar foto, tente novamente',
            2000,
            'danger'
          );
          console.log(err);
        }
      );
    // this.imagePicker
    //   .getPictures({
    //     quality: 100,
    //     maximumImagesCount: 1,
    //     title: 'Selecionar foto',
    //     outputType: 1, // base64
    //   })
    //   .then(
    //     (results) => {
    //       this.exibirFoto = 'data:image/png;base64,' + results[0];
    //       const randomId = Math.random().toString(36).substring(2);
    //       const ref = this.afStorage.ref(randomId);
    //       const task = ref.put(
    //         this.dataURItoBlob('data:image/png;base64,' + results[0])
    //       );
    //       this.uploadProgress = task
    //         .snapshotChanges()
    //         .pipe(map((s: any) => s.bytesTransferred / s.totalBytes));
    //       task.then((res) => {
    //         ref
    //           .getDownloadURL()
    //           .toPromise()
    //           .then((result) => {
    //             this.verFoto = result;
    //           });
    //       });
    //     },
    //     (err) => {
    //       alert(err);
    //     }
    //   );
  }

  private dataURItoBlob(dataURI: string) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}
