import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  host: { 'class': 'is-header2' },
  templateUrl: 'settings.html',
})
export class settingsPage {
  header_data:any;
  user:any = {
    name: 'Eric Black',
    profession: 'Designer at Alphabet',
    phone: '+1 234 567 8899',
    email: 'eric.black@gmail.com',
  };
  time:any;

  fields:any  = {
     phone: 'on', // on/off
     email: 'on',
     notifications: 'yes', // yes/no
     localization: 'yes',
     public_profile: 'yes',
  };

  constructor(public navCtrl: NavController) {
      this.header_data = { title: 'Settings',  class: '' };
      let d = new Date();
      this.time = '4444';
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }

}

