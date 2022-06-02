import {Component} from "@angular/core";
import {Events} from "ionic-angular";
import {signup} from '../signup/signup'
import {slider} from "../slides/slides";
import {services} from "../../service/services";
import {resetinitiate} from "../resetInitiate/resetinitiate";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {notificationsPage} from "../notifications/notifications";
@Component({
  selector:'login',
  templateUrl:'login.html',
  providers:[services]
})
export class login{
  pages:{signup:any,slides:any,initiateRest:any,notification:any};
  login:any;
  type:string;
  loginForm:any;
  constructor(public events:Events,public service:services,public formbuilder:FormBuilder){
    this.pages={
      signup:signup,
      slides:slider,
      notification:notificationsPage,
      initiateRest:resetinitiate
    };
    this.type='login';
    this.service.type=this.type;
    this.login={
      user:'',
      password:''
    };
    this.loginForm = new FormGroup({
      'user':new FormControl(this.login.user,[Validators.required,Validators.minLength(3)]),
      'password':new FormControl(this.login.password,[Validators.required,Validators.minLength(5)])
    });
  }
  Goto(to:string):void{
    this.events.publish('nav:push',this.pages[to],{},true);
  }


  loginNow():void{
    let loginObj = {login: this.loginForm.get('user').value, password: this.loginForm.get('password').value };
    this.service.getUrl('auth/login',loginObj,'post',false).subscribe(data=>{
      Promise.resolve(data).then(a=>{
        this.service.stopLoading();
        console.log(a);
        if(a.content) {
          this.service.authentication = a.content.token;
          try{
            this.redirect(a.content.permission);
          }catch(e){
            console.error(e);
          }
        }
      })
    },error=>{
      this.service.stopLoading();
      this.service.Alert(this.type,error.statusText,['Dismiss']);
    })
  }

  redirect(permission:number):void{
    this.service.initializeToken();
    this.events.publish('session:login');
  }

}
