
import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {Events, NavController, NavParams, Platform} from "ionic-angular";
import {services} from "../../service/services";
import {AddPropertyMain} from "../AddPropertyMain/AddPropertyMain";
import {properties} from "../properties/properties";
@Component({
  selector: 'page-profile',
  templateUrl:'profile.html',
  providers:[services]
})
export class profile {
  @ViewChild('fileInp') fileInput: ElementRef;
  header_data:object;
  User:{
      property:Array<any>,
      user:Array<any>
  };
  properties:object;
  edit:boolean;
  
  modal = [
    {id: 'modal-email', display: 'hidden'},
    {id: 'modal-mobile', display: 'hidden'},
    {id: 'modal-work', display: 'hidden'},
    {id: 'modal-name', display: 'hidden'},
  ];

  constructor(public events:Events,public navCtrl:NavController,public service:services,public navparam:NavParams,public change:ChangeDetectorRef){
 
    this.header_data = { title: 'Profile',  class: '' };

    this.User = {
       user:[],
        property:[]
  };
    this.edit = false;

    this.getProfile();
  }

  fileUpload(event) {
     let file=event.srcElement.files[0];
     if(file){
         this.service.sendFiles('tools/upload?call=users',file).subscribe(a=>{
             this.getProfile();
         })
     }
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  openModal(i){
    for (var x in this.modal){
      this.modal[x].display = 'hidden';
    }
    this.modal[i].display = 'block'; 
  }

  closeModal(i){
    this.modal[i].display = 'hidden'; 
  }
  CloseAllModal(){
      for (var x in this.modal){
          this.modal[x].display = 'hidden';
      }
  }


  getProfile():void{
      this.service.getUrl('user/list',{},'get',true).subscribe(data=>{
          this.service.type='SubCategory';
          return Promise.resolve(data).then(a=>{
              console.log('got category');
              this.service.stopLoading();
              console.log(a);
              if(a.content) {
                  try{
                      this.User=a.content;
                      console.log('categories received');
                      this.change.detectChanges();
                  }catch(e){
                      console.error(e);
                  }
              }
          })
      },error=>{
          try{
              this.service.stopLoading();
              // this.service.Alert(this.type,error.statusText,['Dismiss']);
          }catch(e){}
      })
  }


  saveProfile():void{
      if(this.User.user[0]){
          this.service.getUrl('user/update',this.User.user[0],'post',true).subscribe(a=>{
              this.getProfile();
              this.CloseAllModal();
          },error=>{
              this.service.Alert('Profile',error.statusText,['Dismiss'])
          })
      }
  }


    openProperty(id?:number):void{
      if(id){
          this.events.publish('nav:push',properties,{id:id});
          return;
      }
        this.events.publish('nav:push',AddPropertyMain)
    }



}
