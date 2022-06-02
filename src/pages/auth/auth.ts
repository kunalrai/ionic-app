import {Component} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {login} from '../login/login';
import {signup} from '../signup/signup'
@Component({
  selector:'page-email',
  templateUrl:'auth.html'
})


export class auth{
  pages:{
  login:any,
  signup:any
  };

  constructor(private navCtrl:NavController,public events:Events){
    this.pages={
      login:login,
      signup:signup
    }
  }


  Goto(type:string):void{
    this.events.publish('nav:push',this.pages[type],{},true);

  }
}
