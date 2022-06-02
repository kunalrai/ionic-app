import {Component} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {login} from "../login/login";

@Component({
  selector:'page-password-reset-done',
  templateUrl:'resetconfirmation.html'
})

export class resetconfirmation{
  pages:object;
  constructor(public events:Events,private navCtrl:NavController){
    this.pages={
      login:login
    }
  }

  Goto(to:string):void{
    this.events.publish('nav:push',this.pages[to]);
  }
}
