

import {ChangeDetectorRef, Component} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {properties} from "../properties/properties";
import {services} from "../../service/services";
@Component({
  selector: 'page-my-properties',
  templateUrl:'verification_success.html',
  providers:[services]
})

export class verification_success{
  property:any;
  type:string;
  config:any;
  verification_message:string;
  property_id:number;
  constructor(public events:Events,public navCtrl:NavController,public service:services,public navparam:NavParams,public change:ChangeDetectorRef){
    this.property={
      property:{},
      image:[],
      property_unit:[]
    };
    this.config=this.service.config;
    this.type='VerificationSuccessful';
    this.service.type=this.type;
    this.verification_message=navparam.get('message');
    this.property_id=navparam.get('id');
    console.log(this.verification_message)
    console.log(this.property_id);
    this.getPropertyInformation();
  }

  getPropertyInformation():void {
    this.service.getUrl('property/list/'+this.property_id, {}, 'get', true).subscribe(data => {
      return Promise.resolve(data).then(a => {
        this.service.stopLoading();
        if (a.content) {
          try {
            this.property = a.content;
            this.change.detectChanges();
          } catch (e) {
            console.error(e);
          }
        }
      })
    })
  }
  gotoProperty(){
    this.events.publish('nav:push',properties,{id:this.property_id});
  }
}
