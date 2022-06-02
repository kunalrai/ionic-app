import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-payments',
  host: { 'class': 'is-header2' },
  templateUrl: 'payments.html',
})
export class paymentsPage {
  header_data:any;
  
  month:any = 7;

  data:Array<{name: string, type: string, amount: number, status: string, class: string}>;

  constructor(public navCtrl: NavController) {
      this.header_data = { title: 'Payments',  class: '' };

      this.data = [
         {name: 'Old House', type: 'Caroline Snyder', amount: 457235, status: 'with Family', class: 'status with-family'},
         {name: 'Flat 002', type: 'Luke Franklin', amount: 746428, status: 'wth Bachelors', class: 'status with-bachelors'},
         {name: 'Flat 301', type: 'Lola Coleman', amount: 844679, status: 'Alone', class: 'status alone'},
         {name: 'Building Name', type: 'Luke Reese', amount: 937366, status: 'with Bachelors', class: 'status with-bachelors'},
         {name: 'Flat 301', type: 'Caroline Snyder', amount: 844679, status: 'with Family', class: 'status with-family'},
      ];
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

