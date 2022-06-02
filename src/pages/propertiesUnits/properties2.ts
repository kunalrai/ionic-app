
import {ChangeDetectorRef, Component} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {services} from "../../service/services";
import {AddPropertyMain} from "../AddPropertyMain/AddPropertyMain";
import {properties} from "../properties/properties";
import {LandlordToTenantInvitation} from "../LandLordToTenantInvitation/LandlordToTenantInvitation";

@Component({
  selector: 'page-properties2',
  templateUrl:'properties2.html',
  providers:[services]
})
export class propertiesUnit{
  header_data:object;
  type:string;
  properties:any;
  property_id:number;
  constructor(public events:Events,public navCtrl:NavController,public service:services,public navparam:NavParams,public change:ChangeDetectorRef){

    this.header_data = { title: 'Properties',  class: '' };
    this.type='PropertiesUnit';
    this.service.type=this.type;
    this.property_id=navparam.get('id');
    this.properties = {
      property:{},
      landlord:[],
      image:[],
      property_unit:[],
      invitations:[]
    };
    this.getProperty();
  }



  getProperty():void{

    this.service.getUrl('property/list/'+this.property_id,{},'get',true).subscribe(data=>{
      this.service.type='SubCategory';
      return Promise.resolve(data).then(a=>{
        console.log('got category');
        this.service.stopLoading();
        console.log(a);
        if(a.content && a.content.property.totalTenants !=0) {
          try{
            this.properties=a.content;
            console.log('categories received');
            this.change.detectChanges();
          }catch(e){
            console.error(e);
          }
        }
        else{
          this.navCtrl.push(LandlordToTenantInvitation,{id:this.property_id});
          
        }
      })
    },error=>{
      try{
        this.service.stopLoading();
        // this.service.Alert(this.type,error.statusText,['Dismiss']);
      }catch(e){}
    })
  }

  openProperty(unit_id:number):void{
    if(unit_id>0 && this.property_id>0){
      this.events.publish('nav:push',LandlordToTenantInvitation,{id:this.property_id,unit_id:unit_id});
      return;
    }
  }


}
