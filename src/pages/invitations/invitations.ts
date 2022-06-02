import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import {services} from "../../service/services";
import {properties} from "../properties/properties";

@Component({
  selector: 'page-invitations',
  host: { 'class': 'is-header2' },
  templateUrl: 'invitations.html',
    providers:[services]
})
export class invitationsPage {
  header_data:any;
  users:Array<any>;
  type:string;
  pages:any;
  constructor(public navCtrl: NavController,public service:services,public change:ChangeDetectorRef) {
     this.header_data = { title: 'Invitations',  class: '' };
     this.type="invitation";
     this.service.type=this.type;
     this.users = [];
     this.getInvites();
     this.pages={
         property:properties
     }
  }

  delete(id:number) {
      this.service.type='DeclineInvitation';
      if(!id && id<1)
          return false;
     this.service.getUrl('invitation/DeleteInvitation/'+id,{},'get',true).subscribe(data=>{
         Promise.resolve(data).then(a=>{
             console.log(a);
             if(a && a.content){
                 this.service.Alert(this.service.type,a.statusText,['Dismiss']);
             }
             this.getInvites();
     })
     },error=>{
         console.log(error);
    this.service.stopLoading();
    this.service.Alert(this.type,error.statusText,['Dismiss']);
})
  }

    OpenInvitation(invitationData:any):void{
      if(invitationData.association_name='property'){
       //   this.navCtrl.push(this.pages[invitationData.association_name],{id:invitationData.property_id});
      }
    }

    AcceptInvitation(id:number):any {
        this.service.type = 'AcceptInvitation';
        if (!id && id < 1)
            return false;
        this.service.getUrl('invitation/AcceptInvitation/' + id, {}, 'get', true).subscribe(data => {
            Promise.resolve(data).then(a => {
                if (a && a.content) {
                    this.service.Alert(this.service.type, a.statusText, ['Dismiss']);
                }
                this.getInvites();
            })
        }, error => {
            this.service.stopLoading();
            this.service.Alert(this.type, error.statusText, ['Dismiss']);
        })
    }
  
  goBack() {
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }

  getInvites():void{
      this.service.getUrl('invitation/lists',{},'get',true).subscribe(data=>{
          Promise.resolve(data).then(a=>{
              console.log(a.content);
              if(a.content)
                  this.users=a.content;
              this.change.detectChanges();
          })

      })
  }
}

