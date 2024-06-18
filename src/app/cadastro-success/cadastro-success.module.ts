import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroSuccessPageRoutingModule } from './cadastro-success-routing.module';

import { CadastroSuccessPage } from './cadastro-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroSuccessPageRoutingModule
  ],
  declarations: [CadastroSuccessPage]
})
export class CadastroSuccessPageModule {}
