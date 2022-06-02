import {ChangeDetectorRef, Component, Injectable, ViewChild} from "@angular/core";
import {Events, NavController} from "ionic-angular";
import {login} from "../login/login";
import {otp} from "../otp/otp";
import {services} from "../../service/services";
import {FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector:'page-new-signup',
  templateUrl:'signup.html',
  providers:[services]
})

export class signup{
  switches:boolean;
  pages:{
    login:any,
    otp:any
  };
  type:string;
  registerForm:any;
  user:{
    firstname:string,
    lastname:string,
    email:string,
    username:string,
    mobile:number,
    password:string,
    email2:string,
    switch:boolean,
    isMobileVerification:boolean
  };

  time:any;


  constructor(public events:Events,public navCtrl:NavController,public services:services,public change:ChangeDetectorRef){

    let d = new Date();
    this.time = d.getTime();

    this.pages={
      login:login,
      otp:otp
    };
    this.switches=true;
    this.type='signup';
    this.services.type=this.type;
    this.user={
      firstname:'',
      lastname:'',
      username:'',
      email:'',
      mobile:null,
      password:'',
      email2:'',
      switch:true,
      isMobileVerification:false
    };

    this.registerForm=new FormGroup({
      'firstname':new FormControl(this.user.firstname,[Validators.required,Validators.minLength(3)]),
      'lastname':new FormControl(this.user.lastname,[Validators.required,Validators.minLength(3)]),
      'email':new FormControl(this.user.email,[Validators.required,Validators.email]),
      'mobile':new FormControl(this.user.mobile),
      'password':new FormControl(this.user.password,[Validators.required,Validators.minLength(5)]),
      'email2':new FormControl(this.user.email2,[Validators.required,Validators.email]),
      'isMobileVerification':new FormControl(this.user.isMobileVerification)
    });

  }

  Goto(to:string):void{
    this.events.publish('nav:push',this.pages[to],{},true);
  }

  signupNow():void{
    this.user=this.registerForm.value;
    console.log(this.registerForm);
    console.log(this.user);
    if(this.user.email==this.user.email2){
      this.user.username = this.user.firstname + this.user.lastname;
      this.user.switch=this.switches;
      this.services.getUrl('auth/register',this.user,'post',false).subscribe(data=>{
        return Promise.resolve(data).then(r=>{
          this.services.stopLoading();
          if(r.content) {
            this.services.Alert(this.type,r.statusText,['Dismiss']);
            this.events.publish('nav:push',otp,{id:r.content.id,mobile:this.user.isMobileVerification})
            }
        })
      },error=>{
        this.services.stopLoading();
        this.services.Alert(this.type,error.statusText,['Dismiss']);
      })
    }else{
      this.services.Alert(this.type,"Email and confirm email does not match!",['Dismiss']);

    }

  }
  setPerm(value){
   this.switches=value;
   this.change.detectChanges();
  }

}
