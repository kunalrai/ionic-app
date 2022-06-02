
import {ChangeDetectorRef, Component} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {services} from "../../service/services";
import {AddPropertyMain} from "../AddPropertyMain/AddPropertyMain";
import {properties} from "../properties/properties";
import {propertiesUnit} from "../propertiesUnits/properties2";
import {LandlordToTenantInvitation} from "../LandLordToTenantInvitation/LandlordToTenantInvitation";

@Component({
  selector: 'page-properties2',
  templateUrl:'properties2.html',
  providers:[services]
})
export class properties2 {
  header_data:object;
  properties:object;

  constructor(public events:Events,public navCtrl:NavController,public service:services,public navparam:NavParams,public change:ChangeDetectorRef){

    this.header_data = { title: 'Properties',  class: '' };

    this.properties = [];
    this.getProperty();
  }



  getProperty():void{

    this.service.getUrl('user/list',{},'get',true).subscribe(data=>{
      this.service.type='SubCategory';
      return Promise.resolve(data).then(a=>{
        console.log('got category');
        this.service.stopLoading();
        console.log(a);
        if(a.content && a.content.property.length>0) {
          try{
            this.properties=a.content;
            
            console.log('categories received');
            this.change.detectChanges();
          }catch(e){
            console.error(e);
          }
        }
        else 
        {
          this.navCtrl.push(AddPropertyMain);
        }
      })
    },error=>{
      try{
        this.service.stopLoading();
        // this.service.Alert(this.type,error.statusText,['Dismiss']);
      }catch(e){}
    })
  }

  openProperty(item:any):void{
    if(item.property_id && item.property_category!=2){
      //this.events.publish('nav:push',LandlordToTenantInvitation,{id:item.property_id});
      this.events.publish('nav:push',properties,{id:item.property_id});
      return;
    }else if(item.property_category==2){
      //this.events.publish('nav:push',propertiesUnit,{id:item.property_id})
      this.navCtrl.push(propertiesUnit,{id:item.property_id});
      return;
    }
    this.events.publish('nav:push',AddPropertyMain)
  }


}
