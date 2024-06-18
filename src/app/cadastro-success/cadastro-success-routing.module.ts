import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroSuccessPage } from './cadastro-success.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroSuccessPageRoutingModule {}
