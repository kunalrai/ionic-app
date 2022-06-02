import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-payments-final-details',
  host: { 'class': 'is-header2' },
  templateUrl: 'payments-final-details.html',
})
export class paymentsFinalDetailsPage {
  header_data:any;
  flat:any = {name: 'Flat 002'};
  month:any = 7;
  sort_by:any;

  data:Array<{name: string, date: string, amount: number, method: string, paid_by: string}>;

  constructor(public navCtrl: NavController) {
      this.header_data = { title: this.flat.name,  class: '' };

      this.data = [
         {name: 'July Rent', date: 'July 3, 2017', amount: 4500, method: 'Paypal', paid_by: 'Sally Stevens'},
         {name: 'June Rent', date: 'June 1, 2017', amount: 4500, method: 'Paypal', paid_by: 'Troy Mills'},
         {name: 'May Rent', date: 'May 4, 2017', amount: 4500, method: 'Paypal', paid_by: 'Augusta Doyle'},
         {name: 'April Rent', date: 'April 3, 2017', amount: 4500, method: 'Paypal', paid_by: 'Augusta Doyle'},
      ];
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

