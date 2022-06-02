import {ChangeDetectorRef, EventEmitter, Injectable, NgModule} from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Storage} from '@ionic/storage';
import {LoadingController, AlertController, Platform, ToastController, NavController, Events} from "ionic-angular";
import {Facebook,Google} from "ng2-cordova-oauth/core";
import {OauthCordova} from "ng2-cordova-oauth/platform/cordova";
import { ScreenOrientation} from '@ionic-native/screen-orientation';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { Geolocation } from '@ionic-native/geolocation';
import {AutoCompleteService} from 'ionic2-auto-complete';
import {login} from "../pages/login/login";


interface ServiceInterface{
  getUrl:(url:string,body:any,type:string,isProtected:boolean)=>any;
  loading:(type:string,Msg:string)=>void;
  stopLoading:()=>void;
  Alert:(title:string,subTitle:string,button:Array<string>)=>void;
  initializeToken:()=>void;
  sendFiles:(url:string,body:any,type:string,isProtected:boolean)=>any;
}



//let endpoint='http://rental-env.jyvbbrsifq.us-east-2.elasticbeanstalk.com/';
//let endpoint='http://localhost:8888/';
//let endpoint='http://ec2-18-218-42-69.us-east-2.compute.amazonaws.com/';
let endpoint='http://ec2-18-216-53-83.us-east-2.compute.amazonaws.com/';

//let endpoint='http://barwaonline.com/';

let config={
  authType:'Authorization',
  url:endpoint,
  endpoint:endpoint+'api.php/',
  loadingTimeout:200,
  assetsDir:'../assets/dev/'
};
let fileCount:number=0;
let update:string;
let projectId=0;
let authentication='';










@Injectable()
export class services   implements ServiceInterface {
  authentication: string;
  content_type: string;
  delayInstance:any;
  progress: any;
  type: string;header;
  config: any;
  load: any;
  authStorage: string;
  loaderMsg: string;
  toastOn:boolean;
  permission:number;
  taskdone:boolean=false;
  public emit: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private orientation:ScreenOrientation,public event:Events,private http: Http,public storage: Storage,public toastCtrl:ToastController, public loader: LoadingController, public alert: AlertController, public platform: Platform,public filetransfer:FileTransfer,public file:File,public change:ChangeDetectorRef) {

    platform.ready().then(()=>{
      try{
        this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT).then(a=>{
          console.log('changing screen to landscape mode');
          console.log('reply: ');
          console.log(a);
        },(e)=>{
          console.error('cannot change screen  orientation to landscape');
          console.error('reason: ');
          console.error(e)
        })
      }catch(e){
        console.error('screen resolution plugin not available');
      }

      this.permission=0;
    })
    this.toastOn=false;
    this.loaderMsg = '';
    this.config = config;
    this.load = false;
    this.loaderMsg = 'Please wait...';
    this.authStorage = 'login';
    this.initializeToken();
  }

  loading(type: string, message: string): void {
    try {
      if (!this.load) {
        this.load = this.loader.create({
          content: message
        });
        this.load.present();
      }else{
        this.stopLoading();
        this.loading(type,message);
      }
    } catch (e) {
      console.error(e);
    }

  }

  existsInId(array,id,search?:string):boolean{
    if(!search)
      search='id';
    for(let i in array){
      if(array[i][search]==id){
        return true;
      }
    }
  }
  Alert=(title: string, subTitle: string, button: Array<any>): void=> {
    try {
      let alert = this.alert.create({
        title: title,
        subTitle: subTitle,
        buttons: button
      });
      alert.present();
    } catch (e) {
      console.error(e);
    }

  }

  initializeToken=(): any=>{
       return  this.storage.get(this.authStorage).then(data => {
          try{
            if (data.content) {
              this.permission=data.content.permission;
              authentication='Basic '+data.content.token;
              if(data.content.token)
                this.event.publish('token:available',data.content.token)
            }
          }catch(e){

          }

        });

  }

  private echo(url, body, isProtected,head, type,prefix) {
    console.log('endpoint is ' + url);
    console.log('body is');
    console.log(body);
    console.log('request method is ' + type);
    console.log('page is request ' + isProtected ? 'Protected' : 'not protected');
    console.log('headers ');
    console.log(head);
    console.log(' and url prefix ==');
    console.log(prefix);

  }

  getUrl=(url: string, body: any, type: string, isProtected: boolean): any=> {
    this.initializeToken();

      let head:any;
      this.loading(this.type, this.loaderMsg);
      let headers=new Headers();
      if(this.type=='login')
        this.event.publish('socket:reconnect');
      headers.append('Authorization',authentication);
      headers.append('Content-Type','application/json');
      if(isProtected){
        head=headers;
        if(type=='get'){
          body={headers:head};
        }
      }else{
        head='';
      }
      console.log('headers');
      console.log(head);

      let urlPrefix=!url.startsWith('http')?this.config.endpoint:'';
      this.echo(urlPrefix+url, body, isProtected, head,type,urlPrefix);
      return this.http[type](urlPrefix + url,body,{headers:head})
          .map(data => {
            this.stopLoading();
            this.initializeToken();
            return data.json()})
          .catch(data=>{
            let dat=data.json();
            this.initializeToken();
            if(dat.status==403){
              this.event.publish('session:expired');
            }
            this.stopLoading();
            return Promise.reject(dat);
          })
          .map(r => this.storage.set(this.type, r))
          .map(r => r);



  };

  stopLoading(): void {
        if (this.load) {
          try {
              this.load.dismiss();
              this.load = false;
          } catch (e) {
            console.error(e);
          }
        }
  }








  setMessage=()=>{
    this.taskdone=true;
    this.change.detectChanges();

  };




  presentToast=(message:string) =>{
    if(!this.toastOn){
      let that=this;
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
        that.toastOn=false;
      });

      toast.present().then((a)=>{
        toast.dismissAll();
        that.toastOn=true;
      },error=>{
        console.log('toast promise rejection');
      });
    }

  };



  sendFile(url:string,fileUrl:string,filename:string,that:any,length:number):any{

    let options: FileUploadOptions= {
      fileKey: "x84d5FILES",
      fileName: filename
    };
    let TransferClass=new FileTransfer();
    let transfer=TransferClass.create();
    let urlPrefix=!url.startsWith('http')?config.endpoint:'';
    transfer.onProgress((progress)=>{
      if(progress.lengthComputable){
     // that.presentToast('Transfer in progress '+Math.ceil((progress.loaded/progress.total)*100)+'% '+fileCount+' of '+length);
      }
    });
   return transfer.upload(fileUrl,urlPrefix+url,options)

    }
  randomString(length:number, chars:string):string {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
  }

  getFileEntry(url:string,fileData:any,length:number):any{
    let osPath = this.file.dataDirectory;
    let pathfile=this.file;
    let that=this;
    let filename=this.randomString(10,'aA')+'.jpg';
    console.log('filename is');
    console.log(filename);

    return new Promise((resolve,reject)=>{
      this.file.writeFile(osPath, filename, fileData, true).then(function(success) {
        pathfile.resolveLocalFilesystemUrl(osPath+filename).then((entry)=> {
          that.sendFile(url, entry.toInternalURL(), filename,that,length).then(a=>{
            resolve(a);
          },error=>{
            reject(error);
          })
        },(error)=>{
          console.log(error);
          that.Alert('File System','Could not resolve file system for selected file',['Dismiss']);
          that.Alert('File System',error,['Dismiss']);
          reject(error);
        })
      },function(err){
        that.Alert('Permission','Cannot write file to device!',['Dismiss']);
        console.log(err);
        reject(err);
      })
    })


  }


  delay=(callback:()=>any,seconds:number):any=>{
    if(!this.delayInstance){
      this.delayInstance=setTimeout(()=>{
        callback();
        clearTimeout(this.delayInstance);
        this.delayInstance=false;
      },seconds);
    }
  };

  sendFiles(url: string, files: any): any {
    this.initializeToken();
    console.log(authentication);

    let headers=new Headers();
    headers.append('Authorization',authentication);

    let input = new FormData();
    input.append("x84d5FILES", files);
   /* console.log(files.name);
    this.getUrl('tools/sendMessage',{message:files.name},'post',false).subscribe(a=>{
      console.log('message status');
      console.log(a);
    });*/
    return this.http.post(this.config.endpoint + url,input,{headers:headers})
        .map(data => {
      console.log(data);
      return data.json()})
        .catch(data=>{
          console.log(data);
          let dat=data.json();
          if(dat.status==403){
            this.event.publish('session:expired');
          }
          return Promise.reject(dat);
        })
  }

  getDateBack(str1, str2) {
    let diff = Date.parse(str2) - Date.parse(str1);
    return isNaN(diff) ? NaN : {
      diff: diff,
      ms: Math.floor(diff % 1000),
      s: Math.floor(diff / 1000 % 60),
      m: Math.floor(diff / 60000 % 60),
      h: Math.floor((diff / 3600000 % 24) + 1),
      d: Math.floor(diff / 86400000)
    };
  }

  Link(url:string):string{
      if(!url)
        return 'http://placehold.it/300x300';
      if(!url.startsWith('http'))
        return endpoint+url;
      return url;
  }
}



















export class oauthProviders{
  public facebook:Facebook=new Facebook({
    clientId:"1244733552338506",
    appScope:['email']
  });

  public google:Google=new Google({
    clientId:'716988310185-27jhhdukdatps8481oroq0t2o53k96r6.apps.googleusercontent.com',
    redirectUri:'http://127.0.0.1:8000/callback',
    appScope:['email'],
    responseType:'code'
  });
}


interface socialInterface{
  google:()=>any;
  facebook:()=>any;
}
@Injectable()
export class social_auth implements socialInterface {
  private oauth: OauthCordova = new OauthCordova();
  Endpoints: {
    facebook: string,
    google: any
  };
  providers: oauthProviders;

  constructor(private platform: Platform) {
    this.providers = new oauthProviders();
    this.Endpoints = {
      facebook: 'https://graph.facebook.com/v2.10/me?fields=id,name,picture.width(500),first_name,last_name,email&access_token=',
      google: {
        url: 'https://www.googleapis.com/oauth2/v2/userinfo?access_token=',
        clientId: '716988310185-27jhhdukdatps8481oroq0t2o53k96r6.apps.googleusercontent.com',
        redirectUri: 'http://127.0.0.1:8000/callback',
        clientSecret: 'BJB184EmTnGvDIv7Sro22x70'
      }
    }
  }

  public facebook(): any {
    return this.oauth.logInVia(this.providers.facebook);
  }

  public google(): any {
    return this.oauth.logInVia(this.providers.google);
  }
}















@Injectable()
export class geolocation{
  apiKey:string;
  constructor(public service:services,private geolocation: Geolocation,public http:Http,private events:Events){
    this.apiKey='AIzaSyBWu-zSKshTiDmFHQbHENSzFP_RWGw6uRQ';
  }

  getLocationJson=():any=>{
    return new Promise((resolve,reject)=>{
      this.deviceGeolocation().then((a)=>{
        console.log('geolocation');
        console.log(a);
        this.service.type="geolocation";
        this.service.getUrl('https://maps.googleapis.com/maps/api/geocode/json?latlng='+a.latitude+','+a.longitude+'&key='+this.apiKey,{},'get',false).subscribe(r=>{
          Promise.resolve(r).then(a=>{


            resolve(this.arrangeAddress(a.results))
          },error=>{
            console.log('geolocation service has failed');
            console.log(error);
          })
      });


      },error=>{
        reject(error)
      })
    })


  };


  arrangeAddress(a:any){
    let promiseData={
      address:'',
      country:'',
      state:'',
      address2:'',
      zip:''
    };
    for(var i in a){
      let addressComponent=a[i].address_components;
      for(var u in addressComponent){
      if(addressComponent[u].types.includes('locality') && addressComponent[u].types.includes('political')) {
        if(!promiseData.state.includes(addressComponent[u].long_name)) {
          promiseData.state+= addressComponent[u].long_name+' ';
        }
      }else if(addressComponent[u].types.includes('country') || addressComponent[u].types.includes('administrative_area_level_1') ||  addressComponent[u].types.includes('political') || addressComponent[u].types.includes('country')){
        if(!promiseData.address2.includes(addressComponent[u].long_name)) {
          promiseData.address2 += addressComponent[u].long_name + ' ';
        }
      }else if(addressComponent[u].types.includes('route')   || addressComponent[u].types.includes('administrative_area_level_3') || addressComponent[u].types.includes('street_number')){
        if(!promiseData.address.includes(addressComponent[u].long_name)){
          promiseData.address+=addressComponent[u].long_name+' ';
        }
      }else if(addressComponent[u].types.includes('postal_code')){
        promiseData.zip=addressComponent[u].long_name;
      }
      }

    }
    return promiseData;
  }


  private deviceGeolocation():any{
    return new Promise((resolve,reject)=>{
      if(navigator.geolocation){
        var options={
          enableHighAccuracy:true
        }
        navigator.geolocation.getCurrentPosition(position=>{
          let geodata={longitude:position.coords.longitude,latitude:position.coords.latitude};
          console.log('geo data');
          console.log(geodata);
          resolve(geodata)
        },error=>{
          console.log(error);
          this.service.Alert('Geolocation','Could not determine location',['Dismiss']);
        })
      }else{
        this.service.Alert('Geolocation','Could not determine location, Please make sure gps is enabled',['Dismiss']);
      }


    });
  }

  public searchName(name:string):any{

    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+name+'&key='+this.apiKey)
        .map(
            result =>
            {
              let results=result.json().results;
              console.log(results);
              return results;
            });
  }




}



@Injectable()
export class searchService implements AutoCompleteService{
  labelAttribute = "formatted_address";

  constructor(public geo:geolocation) {

  }


  getResults(name:string):any{
    //console.log(name);
    return this.geo.searchName(name);
  }

}



