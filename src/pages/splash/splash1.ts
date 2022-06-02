import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-splash1',
  templateUrl: 'splash1.html',
})
export class splash1Page {

  constructor(public navCtrl: NavController) {
      
  }

  ngAfterViewInit() {
  	// var t = this;
   //     setTimeout(function () {
   //       t.navCtrl.push(splashPage);
   //     },3000);
  }

  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

