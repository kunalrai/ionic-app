import {Component} from '@angular/core';
import {AlertController, Events, NavController} from "ionic-angular";
import {auth} from '../../pages/auth/auth';
import {geolocation, services, social_auth} from "../../service/services";
import {LandlordToTenantInvitation} from "../LandLordToTenantInvitation/LandlordToTenantInvitation";
import {otp} from "../otp/otp";
import {slider} from "../slides/slides";
import {AddPropertyMain} from "../AddPropertyMain/AddPropertyMain";
import {notificationsPage} from "../notifications/notifications";
import {propertymain} from "../propertymain/propertymain";
import {properties} from "../properties/properties";

@Component(
  {
    selector:'entry',
    templateUrl:'entry.html',
    providers:[social_auth,services]
  })




export class entry{
  pages:{slides:any,notification:any};
  accessToken:{
    facebook:string;
    google:string;
  };
  type:string;
  SocialData:{
    social:string;
    data:any;
  };
  EssentialSocialData:{
    mobile:any,
    email:string;
  };
  modalTitle:string;
  constructor(public events:Events,private navCtrl:NavController,public social:social_auth,public service:services,public alertCtrl:AlertController){
    this.accessToken={
      facebook:'',
      google:''
    };

    this.pages={
        slides:slider,
        notification:notificationsPage
    }
    this.type="SocialAuthentication";
    this.service.type=this.type;
    this.SocialData={
      social:'',
      data:{}
    };
    this.EssentialSocialData={
      mobile:'',
      email:''
    };
    this.modalTitle='Email and Mobile are required';

  }
  gotoEmail():void{
      this.events.publish('nav:push',auth);
  }

  guest_payment():any{
      //this.navCtrl.push(properties,{id:5});
  }


  private TrySocialAccount():void{
    /*if(this.EssentialSocialData.mobile && this.EssentialSocialData.email){
      this.SocialData.data.mobile=this.EssentialSocialData.mobile;
      this.SocialData.data.email=this.EssentialSocialData.email;*/
      this.service.getUrl('auth/social',this.SocialData,'post',false).subscribe((apidata)=>{
        Promise.resolve(apidata).then(a=>{
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
   /* }else{
      this.EssentialModal();
    }*/
  }

  private EssentialModal():void{
    if(this.SocialData.data.email && this.SocialData.data.mobile){
      this.TrySocialAccount();
      return;
    }
    let popController=this.alertCtrl.create({
      title:this.modalTitle,
      inputs:[
        {
          name:'email',
          placeholder:'Your email',
          type:'email'
        },
        {
          name:'mobile',
          placeholder:'mobile',
          type:'tel'
        }
      ],
      buttons:[
        {
          text:'continue',
          handler:data=>{
            if(data.email && data.mobile){
              this.EssentialSocialData.email=data.email;
              this.EssentialSocialData.mobile=data.mobile;
              this.TrySocialAccount();
            }else{
              this.modalTitle="Complete this inorder to continue!";
              this.EssentialModal();
            }
          }
        }
      ]
    });
    popController.present();

  }
    facebookLogin():void{
      this.social.facebook().then((a)=>{
        console.log('facebook access token');
        console.log(a);
        this.accessToken.facebook=a.access_token;
        this.service.type='FacebookAuthentication';
        this.service.loaderMsg="Authenticating Facebook, Please Wait....";
        this.service.getUrl(this.social.Endpoints.facebook+this.accessToken.facebook,null,'get',false).subscribe((data)=>{
          Promise.resolve(data).then((a)=>{
            console.log('facebook data');
            console.log(a);
            this.SocialData.social='facebook';
            this.SocialData.data=a;
            console.log(this.SocialData);
            this.service.type='login';
            this.service.loaderMsg="Almost done, Still in progress..."
            this.TrySocialAccount();
          })
        })
      },err=>{
        this.service.stopLoading();
        this.service.Alert(this.type,err,['Dismiss']);      });
    }
    googleLogin():void{
        this.social.google().then((a)=>{
            console.log('google access token');
            console.log(a);
            this.service.getUrl('https://www.googleapis.com/oauth2/v4/token?code='+a.code+'&client_id='+this.social.Endpoints.google.clientId+'&client_secret='+this.social.Endpoints.google.clientSecret+'&redirect_uri='+this.social.Endpoints.google.redirectUri+'&grant_type=authorization_code',{},'post',false)
                .subscribe(data=>{
                    Promise.resolve(data).then((r)=> {
                        console.log(r);
                        this.accessToken.google = r.access_token;
                        this.service.type = 'GoogleAuthentication';
                        this.service.loaderMsg = "Authenticating Google, Please Wait....";
                        this.service.getUrl(this.social.Endpoints.google.url + this.accessToken.google, {}, 'get', false).subscribe((data) => {
                            Promise.resolve(data).then((a) => {
                                console.log('google data');
                                console.log(a);
                                this.SocialData.social = 'google';
                                this.SocialData.data = a;
                                this.service.type = 'login';
                                console.log(this.SocialData);
                                this.service.loaderMsg = "Almost done, Still in progress...";
                                this.TrySocialAccount()
                            })
                        },error=>{
                            console.log(error);
                        })
                    })
                },error=>{
                    this.service.stopLoading();
                    console.error(error);
                    this.service.Alert(this.type,'Google authentication failed',['Dismiss']);
                });
        },error=>{
            console.log(error);
            this.service.stopLoading();
            this.service.Alert(this.type,error,['Dismiss']);
        })
    }

    Goto(to:string):void{
        this.events.publish('nav:push',this.pages[to]);
    }



    redirect(permission:number):void{
        this.service.initializeToken();
        this.events.publish('session:login');
        setTimeout(a=>{
            if(permission==3){
                this.Goto('slides');
            }else if(permission==2){
                this.Goto('notification');
            }
        },100);

    }
}
