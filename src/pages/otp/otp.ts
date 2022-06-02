import {Component, ViewChild,ChangeDetectorRef} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {created} from "../created/created";
import {services} from "../../service/services";

@Component({
  selector:'page-confirm-account',
  templateUrl:'otp.html',
  providers:[services]
})


export class otp{
  @ViewChild('msg[0]') VC_0;
  @ViewChild('msg[1]') VC_1;
  @ViewChild('msg[2]') VC_2;
  @ViewChild('msg[3]') VC_3;
  pages:object;
  time:string;
  type:string;
  resetAgain:boolean;
  mins:number;
  id:number;
  msg:Array<any>;
  seconds:number;
  timeoutInstance:any;
  isMobile:boolean;
  constructor(public events:Events,private navCtrl:NavController,public service:services,private navparam:NavParams,public change:ChangeDetectorRef){
    this.pages={
      created:created
    };
    this.type='verify';
    this.service.type=this.type;
    this.time='';
    this.mins=10;
    this.seconds=0;
    this.resetAgain=false;
    this.msg=[];
    this.id=this.navparam.get('id');
    this.isMobile=this.navparam.get('mobile');
    this.countDown();

  }
  countDown():void{
    this.resetAgain=false;
    this.timeoutInstance=setTimeout(()=>{
      if(this.seconds<=0){
        this.mins--;
        this.seconds=59;
      }else if(this.seconds>=1) {
        this.seconds--;
      }
      let MinPrefix=this.mins.toString().length<2?'0':'';
      this.time=MinPrefix+this.mins+':'+this.seconds;
      if(this.mins==0 && this.seconds==0){
      clearTimeout(this.timeoutInstance);
      this.resetAgain=true;

      }else{
        this.countDown();
      }
    },1000)
  }

  Goto(to:string):void{
    this.events.publish('nav:push',this.pages[to]);
  }
  code():string{
    var c='';
    for(var i in this.msg){
      c+=this.msg[i];
    }
    return c;
  }

  verify():void{
    this.service.getUrl('auth/verifyRegistration', {'type':'registration', 'code':this.code()},'post',false).subscribe(data=>{
      try{
        return Promise.resolve(data).then(a=>{
          this.service.stopLoading();
          if(a.status===201) {
            try{
              this.Goto('created');
            }catch(e){
              console.error(e);
            }
          }else{

          }
        })
      }catch(e){
        console.error(e);
      }

    },error=>{
      try{
        this.service.stopLoading();
        this.service.Alert(this.type,error.statusText,['Dismiss']);
      }catch(e){}

    })
  }
  entered($event,value:any,i:number):void{
  value=parseInt(value);
  this.change.detectChanges();
  if(Number.isInteger(value)){
          this.msg[i]=Number(value.toString().charAt(0));
          console.log('numbers');
  }else{
    this.msg[i]='';
  }
  console.log(value);
  console.log(i);
  console.log($event);
  }
  resendOtp():void{
    if(this.id){
      this.service.getUrl('auth/resendOTP/'+this.id,{},'get',false).subscribe(data=>{
        return Promise.resolve(data).then(a=>{
          this.service.stopLoading();
          if(a.content) {
            try{
            }catch(e){
              console.error(e);
            }
          }
        })
      },error=>{
        try{
          this.service.stopLoading();
          this.service.Alert(this.type,error.statusText,['Dismiss']);
        }catch(e){}
      })
    }else{
      try{ this.service.Alert(this.type,"Cannot resend OTP, invalid user, Please contact admin!",['Dismiss']);}catch(e){}

    }

  }

  onKeyup(event, index){
    var target = event.target || event.srcElement || event.currentTarget;
    var elms = document.getElementById('list').getElementsByClassName('input-number');
    var count = elms.length;

    if (event.keyCode !== 8) {
      if (index < count) {
        document.getElementById('inp'+(index+1)).focus();
      }
    }else{
      if (target.value == "" && parseInt(index) > 1) {
        document.getElementById('inp'+(index-1)).focus();
      }
    }
  }

  onKeypress(event){
    var target = event.target || event.srcElement || event.currentTarget;
    if (target.value.length > 1) {
      return false;
    }
  }

  onFocus(event){
    var target = event.target || event.srcElement || event.currentTarget;
    target.select();
  }

}
