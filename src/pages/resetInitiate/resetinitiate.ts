import {Component} from "@angular/core";
import {Events, NavController} from "ionic-angular";

import {services} from "../../service/services";
import {resetpassword} from "../resetpassword/resetpassword";
@Component({
  selector:'resetInitiate',
  templateUrl:'resetinitiate.html',
  providers:[services]
})

export class resetinitiate {
  pages: { resetpassword:any};
  login: { login: string,isMobileVerification:boolean};
  viewText:{inputType:string,eg:any,label:string};
  type: string;

  constructor(private events:Events, public service: services) {
    this.viewText={
      inputType:'email',
      eg:'yashakhandelwal@gmail.com',
      label:'Email'
    };
    this.pages={
      resetpassword:resetpassword
    };
    this.type = 'initiateReset';
    this.service.type = this.type;
    this.login = {
      login: '',
      isMobileVerification:false
    };
  }

  Goto(to: string): void {
    this.events.publish('nav:push',this.pages[to]);
  }

  initiateNow(): void {
    this.service.getUrl('auth/initiateReset', this.login, 'post', false).subscribe(data => {
      Promise.resolve(data).then(a => {
        this.service.stopLoading();
        if (a.content) {
          this.service.Alert(this.type,a.statusText,['Dismiss']);
          this.service.authentication = a.content.token;
          try {
            this.Goto('resetpassword');
          } catch (e) {
            console.error(e);
          }
        }
      })
    }, error => {
      this.service.stopLoading();
      this.service.Alert(this.type, error.statusText, ['Dismiss']);
    })
  }
  changeVerification(selected:boolean):void{
    if(selected)
      this.viewText={
        inputType:'number',
        eg:123485329000,
        label:'Mobile'
      };
    else
      this.viewText={
        inputType:'email',
        eg:'yashakhandelwal@gmail.com',
        label:'Email'
      };
  }
}
