import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Keys } from '../core/Keys';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {
  primeiroAcessoNoApp = 'não';

  constructor(private router: Router, private navController: NavController, ) {
    if(localStorage.getItem(Keys.slFirstTime) && localStorage.getItem(Keys.userProf)){
      this.router.navigate(['/tabs/tab1']);
    } else if (localStorage.getItem(Keys.slFirstTime) && !localStorage.getItem(Keys.userProf)){
      this.router.navigate(['/login']);
    } 
    else {
        console.log('aguardando primeiro acesso');
    }

   }

  ngOnInit() {
  }

  async irParaInicio(){
  localStorage.setItem(Keys.slFirstTime, this.primeiroAcessoNoApp);
    this.navController.navigateRoot('/login');
  }

}
