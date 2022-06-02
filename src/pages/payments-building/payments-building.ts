import { Component, ViewChild } from '@angular/core';
import {Events, NavController} from 'ionic-angular';

import { paymentsFinalDetailsPage } from '../payments-final-details/payments-final-details';

@Component({
  selector: 'page-payments-building',
  host: { 'class': 'is-header2' },
  templateUrl: 'payments-building.html',
})
export class paymentsBuildingPage {
  header_data:any;
  
  month:any = 7;

  data:Array<{name: string, type: string, amount: number, status: string, class: string}>;

  constructor(public navCtrl: NavController,public events:Events) {
      this.header_data = { title: 'Building',  class: '' };

      this.data = [
         {name: 'Flat 001', type: 'Caroline Snyder', amount: 457235, status: 'with Family', class: 'status with-family'},
         {name: 'Flat 002', type: 'Luke Franklin', amount: 746428, status: 'wth Bachelors', class: 'status with-bachelors'},
         {name: 'Flat 301', type: 'Lola Coleman', amount: 844679, status: 'Alone', class: 'status alone'},
         {name: 'Flat 302', type: 'Luke Reese', amount: 937366, status: 'with Bachelors', class: 'status with-bachelors'},
         {name: 'Flat 303', type: 'Caroline Snyder', amount: 844679, status: 'with Family', class: 'status with-family'},
      ];
  }

  openFlat(){
      this.events.publish('nav:push',paymentsFinalDetailsPage);
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

