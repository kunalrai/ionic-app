import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-documents-2',
  host: { 'class': 'is-header2' },
  templateUrl: 'documents-2.html',
})
export class documents2Page {
  header_data:any;
  date: String = new Date().toISOString();
  constructor(public navCtrl: NavController) {
     this.header_data = {
       title: 'Documents', 
       class: 'no-shadow'
     };
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

