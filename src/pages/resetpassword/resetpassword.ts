import {Component} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {services} from "../../service/services";
import {login} from "../login/login";
import {resetinitiate} from "../resetInitiate/resetinitiate";
import {resetconfirmation} from "../resetconfirmation/resetconfirmation";
import {signup} from "../signup/signup";
@Component({
  selector:'resetpassword',
  templateUrl:'resetpassword.html',
  providers:[services]
})

export class resetpassword{
  pages:{signin:any,confirmation:any,signup:any};
  login:{code:string,new_password:string,cpassword:string};
  type:string;
  constructor(public events:Events,private navCtrl:NavController,public service:services){
    this.pages={
      signin:login,
      confirmation:resetconfirmation,
      signup:signup
    };
    this.type='ResetPassword';
    this.service.type=this.type;
    this.login={
      code:'',
      new_password:'',
      cpassword:''
    };
  }
  Goto(to:string):void{
    this.events.publish('nav:push',this.pages[to]);
  }

  ResetNow():void{
    if(this.login.new_password==this.login.cpassword){
      this.service.getUrl('auth/NewPassword?type=PasswordReset&code='+this.login.code,this.login,'post',false).subscribe(data=>{
        Promise.resolve(data).then(a=>{
          this.service.stopLoading();
          if(a.content) {
            this.service.authentication = a.content.token;
            try{
              this.Goto('confirmation');
            }catch(e){
              console.error(e);
            }
          }
        })
      },error=>{
        this.service.stopLoading();
        this.service.Alert(this.type,error.statusText,['Dismiss']);
      })
    }else{
      this.service.Alert(this.type,"Password and confirm password does not match!",['Dismiss']);
    }

  }

}
