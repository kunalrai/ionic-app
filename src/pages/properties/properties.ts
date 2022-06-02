
import {ChangeDetectorRef, Component} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {services} from "../../service/services";
import {chat} from "../chat/chat";
import {messages} from "../messages/messages";
import {invoice1Page} from "../invoice1/invoice1";
import {invoicePage} from "../invoice/invoice";
import {LandlordToTenantInvitation} from "../LandLordToTenantInvitation/LandlordToTenantInvitation";


@Component({
  selector: 'page-my-properties-house',
  templateUrl:'properties.html',
  providers:[services]
})
export class properties{
  property:any;
  type:string;
  config:any;
  property_id:number;
  header_data:object;
  selectedUser:any;
  days:number;
  startDate:any;
  endDate:any;
  months_n:Array<string> = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  constructor(public events:Events,public navCtrl:NavController,public service:services,public navparam:NavParams,public change:ChangeDetectorRef){
    this.property={
      invitations:[],
      property:{},
      landlord:[],
      image:[],
      property_unit:[]
    };
    this.config=this.service.config;
    this.type='Properties';
    this.service.type=this.type;
    this.property_id=navparam.get('id');
    console.log(this.property_id);
    this.getPropertyInformation();
    this.header_data = { title: this.property.property.property_name,  class: '' };
    this.days=1
    this.selectedUser={};
    
  }

  getPropertyInformation():void {
    this.service.getUrl('property/list/'+this.property_id, {}, 'get', true).subscribe(data => {
      return Promise.resolve(data).then(a => {
        this.service.stopLoading();
        if (a.content  && a.content.property.totalTenants !=0) {
          console.log(a.content);
         
          try {
            this.property = a.content;
            console.log(this.property.invitations);
            this.header_data = { title: this.property.property.property_name,  class: '' };
            this.change.detectChanges();
            this.calculateNextRentInNumDays();
            this.setDateValue();
          } catch (e) {
            console.error(e);
          }
        }
        else{
          this.navCtrl.push(LandlordToTenantInvitation,{id:this.property_id});

        }
      
      })
    })
  }
setDateValue():void{
      let {property_start_date,property_end_date} = this.property.property;
      var sdate = new Date(property_start_date);
      var edate = new Date(property_end_date);
      this.startDate = new Date(sdate.setDate(sdate.getDate())).toISOString();
      this.endDate =new Date(  edate.setDate(edate.getDate())).toISOString();
}
  calculateNextRentInNumDays():void{
    let {property_start_date,property_end_date} = this.property.property;
    if(property_start_date && property_end_date )
    {
      let one_day = 1000*60*60*24;
      let d1 = new Date(property_start_date).getTime() + 30 * one_day;
      let d2 = new Date(property_end_date).getTime();
      this.days =Math.round((d1 - new Date().getTime())/one_day);
    }
}

  OpenChat():void{
    console.log('trying to open chat for user id ');
    if(this.selectedUser.users_id){
      this.events.publish('nav:push',chat,{user:{class:'',title:this.selectedUser.users_firstname+' '+this.selectedUser.users_lastname,id:this.selectedUser.users_id,image_path:this.selectedUser.image_path,receiverName:this.selectedUser.users_firstname+' '+this.selectedUser.users_lastname}})

    }
  }

  OpenInvoice():void{
    if(this.property_id){
      this.events.publish('nav:push',invoicePage,{id:this.property_id})
    }
  }
  
  dateFormat(date,format=""):string{
    if(!format)
       format = 'dd-MM-yyyy'
    if(format ==='dd-MM-yyyy' ){
  
      let date1 = new Date(date)
      var year = date1.getFullYear();
      var month = this.months_n[date1.getMonth()];
      let day = (date1.getDate() < 10 ? '0'+date1.getDate() : date1.getDate());
      return year+'-'+month + '-'+day;
    }
  }

  getData():void{
   
    let {property_start_date,property_end_date} = this.property.property
    var stdate = new Date(this.startDate);
    var edate = new Date(this.endDate);
    if(this.startDate && this.endDate && (stdate.getTime() < edate.getTime())){
       console.log("true");
       
       this.property.property.property_start_date =this.dateFormat(this.startDate); //'dd-MM-yyyy'
       this.property.property.property_end_date= this.dateFormat(this.endDate);
       this.calculateNextRentInNumDays();
       this.service.getUrl('property/update/'+this.property.property.property_id,this.property.property,'post',true)
       .subscribe(data=>{
         console.log(data);
       },error=>{
        this.service.Alert('Properties',"Error while updating please refresh "+error.statusText,['Dismiss'])
       })
      
    }
  }
}
