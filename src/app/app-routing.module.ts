import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/onboard',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },

  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule)
  },
  {
    path: 'profile-user',
    loadChildren: () => import('./profile-user/profile-user.module').then( m => m.ProfileUserPageModule)
  },
  {
    path: 'chat-atendimento',
    loadChildren: () => import('./chat-atendimento/chat-atendimento.module').then( m => m.ChatAtendimentoPageModule)
  },
  {
    path: 'esqueci-senha',
    loadChildren: () => import('./esqueci-senha/esqueci-senha.module').then( m => m.EsqueciSenhaPageModule)
  },
  {
    path: 'service-detail',
    loadChildren: () => import('./service-detail/service-detail.module').then( m => m.ServiceDetailPageModule)
  },
  {
    path: 'onboard',
    loadChildren: () => import('./onboard/onboard.module').then( m => m.OnboardPageModule)
  },
  {
    path: 'cadastro-success',
    loadChildren: () => import('./cadastro-success/cadastro-success.module').then( m => m.CadastroSuccessPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
