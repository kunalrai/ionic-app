

import {ChangeDetectorRef, Component} from "@angular/core";
import {verification_success} from "../verification_success/verification_success";
import {Events, NavController, NavParams} from "ionic-angular";
import {services} from "../../service/services";
@Component({
  selector: 'page-my-properties-house-2',
  templateUrl:'LandlordToTenantInvitation.html',
  providers:[services]
})

export class LandlordToTenantInvitation{
  names:Array<{id:any,name:any}>;
  property:any;
  propertyId:number;
  config:any;
  type:string;
  userindex:number;
  header_data:object;
  invite_unit:number;
  constructor(public events:Events,public NavCtrl:NavController,public navparam:NavParams,public service:services,public change:ChangeDetectorRef) {
    this.config=this.service.config;
    this.userindex=0;
    this.type='SendInvitation';
    this.names = [{
      id:0,
      name:''
    }];
    this.service.type=this.type;
    this.propertyId=navparam.get('id');
    this.invite_unit=navparam.get('unit_id');
    this.property={
      property:{},
      image:[],
      property_unit:[]
    };
    this.config=this.service.config;
    this.getPropertyInformation();
    this.header_data = { title: this.property.property.property_name,  class: '' };

  }

  gotoVerification(){
    this.NavCtrl.push(LandlordToTenantInvitation,{id:this.propertyId});
  }

  getPropertyInformation():void {
  console.log('Shey Shey')
   console.log(this.propertyId)
    this.service.getUrl('property/list/'+this.propertyId, {}, 'get', true).subscribe(data => {
      return Promise.resolve(data).then(a => {
        this.service.stopLoading();
        if (a.content) {
          try {
            this.property = a.content;
            this.header_data = { title: this.property.property.property_name,  class: '' };
            console.log(this.property)
            this.change.detectChanges();
          } catch (e) {
            console.error(e);
          }
        }
      })
    })
  }

  setRange(){
    this.names.push({
      id:0,
      name:''
    });
  }
  search=(index):any=>{
    if(this.names[index]){
      this.service.getUrl('user/search/'+this.names[index].name, {}, 'get', true).subscribe(data => {
        return Promise.resolve(data).then(a => {
          this.service.stopLoading();
          if (a.content) {
            try {

              this.names[index].id=parseInt(a.content.users_id);
              console.log(a.content.users_id)
              this.change.detectChanges();
              console.log(this.names);
            } catch (e) {
              console.error(e);
            }
          }
        })
      })
    }
  };
  searchUser(index):any{
   this.service.delay(():any=>{this.search(index)},5000);
    }

    removeUser(index:number):void{
    this.names.splice(index,1);
    this.change.detectChanges();
    }


    removeEmptyEntry(){
      for (var i = 0; i < this.names.length; i++) {
        if(this.names[i].name.length<2){
          this.names.splice(i,1);
        }
      }
      }

    sendVerifications():void {
      if (this.names.length > 0) {
        this.userindex = 0;
        this.removeEmptyEntry();
        let Urlsuffix='';
        if(this.invite_unit>0){
          Urlsuffix='?invite_unit='+this.invite_unit;
        }
        let userlength = this.names.length;
        for (var i = 0; i < this.names.length; i++) {
          console.log('on loop');
          console.log(i);

          if(this.names[i].name){
              this.service.loaderMsg = 'Sending invite ' + (this.userindex+1) + ' of ' + userlength;
              this.service.getUrl('invitation/create/'+this.propertyId+Urlsuffix, {invite:this.names[i].name}, 'post', true).subscribe(data => {
                console.log('create project successful');
                return Promise.resolve(data).then(a=> {
                  console.log('trying to get promises');
                  console.log(a);
                  this.service.stopLoading();
                  console.log('counting ');
                  console.log(this.userindex);
                  console.log('user length ');
                  console.log(userlength);
                  this.removeUser(this.userindex);
                  if (this.userindex >= userlength-1) {
                    console.log('final creation reached, switching to another page')
                    if (a.content) {
                      console.log('turning to success page');
                      this.events.publish('nav:push',verification_success, {id: this.propertyId, message:a.statusText});
                    }
                  }
                  this.userindex++;
                })
              },error=>{
                console.log(error);
                try {
                  this.service.stopLoading();
                  this.service.Alert(this.type, error.statusText, ['Dismiss']);
                } catch (e) {
                  this.service.Alert(this.type,'Request not successful', ['Dismiss']);
                }
                this.userindex++;
              })
            }

      }
    }
    }

}
