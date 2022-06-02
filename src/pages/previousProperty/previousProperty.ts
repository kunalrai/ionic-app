import {ChangeDetectorRef, Component} from "@angular/core";
import {services} from "../../service/services";
import {Events,  NavParams} from "ionic-angular";
import {LandlordToTenantInvitation} from "../LandLordToTenantInvitation/LandlordToTenantInvitation";

@Component({
  selector: 'page-my-properties-house-3',
  templateUrl:'previousProperty.html',
  providers:[services]
})
export class previousProperty{
  type:string;
  propertyId:number;
  config:any;
  property:{
    property:any,
    image:any,
    property_unit:any
  };
  header_data:object;
  constructor(public events:Events,public change:ChangeDetectorRef,public service:services,public navparam:NavParams) {
    this.type = "NoTenant";
    this.service.type = this.type;
    this.propertyId = navparam.get('id');
    this.property = {
      property: {},
      image: [],
      property_unit: []
    };
    this.config = this.service.config;
    console.log(this.propertyId);
    this.getPropertyInformation();
    this.header_data = { title: this.property.property.property_name,  class: '' };

  }
  gotoVerification(){
    this.events.publish('nav:push',LandlordToTenantInvitation,{id:this.propertyId});
  }



  getPropertyInformation():void{
      this.service.getUrl('property/list/'+this.propertyId,{},'get',true).subscribe(data=>{
      return Promise.resolve(data).then(a=>{
        this.service.stopLoading();
        if(a.content) {
          try{
            this.property=a.content;
            this.header_data = { title: this.property.property.property_name,  class: '' };
            console.log(this.property)
            this.change.detectChanges();
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
  }


}
