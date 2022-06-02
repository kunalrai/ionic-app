import { Component,Input } from '@angular/core';
import { NavController } from 'ionic-angular';
  
@Component({
  selector: 'custom-header',
  templateUrl: 'header.html'
})
export class CustomHeader {
  header_data: any;
  backButton:boolean;
  constructor(public navCtrl: NavController) { this.backButton=false;}

  @Input()
  set header(header_data: any) {
    this.header_data=header_data;
  }

  @Input()
  set EnableBackButton(data:boolean){
    this.backButton=data;
  }

  get EnableBackButton(){
    return this.backButton;
  }
  
  get header() {
    return this.header_data;
  }

  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }

}