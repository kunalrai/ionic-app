
import {Component} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {login} from "../login/login";

@Component({
  selector: 'page-account-created',
  templateUrl:'created.html'
})

export class created{
  pages:object;
  constructor(private navCtrl:NavController,public events:Events){
    this.pages={
      login:login
    }
  }

  Goto(to:string):void{
    this.events.publish('nav:push',this.pages[to]);
  }
}
