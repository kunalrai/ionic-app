import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Events, NavController, Platform} from 'ionic-angular';
import { Slides } from 'ionic-angular';


import jQuery from 'jquery';
import {services} from "../../service/services";
import {invitationsPage} from "../invitations/invitations";
import {properties} from "../properties/properties";
import {invoicePage} from "../invoice/invoice";

@Component({
  selector: 'page-notifications',
  host: { 'class': 'is-header2' },
  templateUrl: 'notifications.html',
    providers:[services]
})
export class notificationsPage {
  @ViewChild(Slides) slides: Slides;
  header_data:any;
  currentDayNumber:number;
  SlideData:any;
  type:string;
  date:any;
  weekday:Array<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  months:Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  months_n:Array<string> = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  currentDate:string;
  list:Array<any>;
  pages:any;
  constructor(public change:ChangeDetectorRef,public navCtrl: NavController, public plt: Platform,public service:services,public events:Events) {
    this.header_data = { title: 'Notifications',  class: '' };
    this.type="Notification";
    this.service.type=this.type;
    this.currentDayNumber=this.getCurrentDay();
    this.SlideData='';
      this.getNotification();
      this.date=[];
      this.pages={
          invitationPage:invitationsPage,
          property:properties,
          invoicePage:invoicePage
      }
  }

  getDates(startDate, stopDate) {

      var dateArray = new Array();
      var currentDate = startDate;
      let i=0;
      while (currentDate < stopDate) {
          var d = new Date (currentDate);
          var day = (d.getDate() < 10 ? '0'+d.getDate() : d.getDate());
          var date = this.dateFormat(d, 'y-m-d');
          dateArray.push({date: date, dayName: this.weekday[d.getDay()], monthName: this.months[d.getMonth()], dayNumber: day});
          currentDate = this.addDays(currentDate, 1);
          i++;
      }
      this.date = dateArray;
      console.log('last array');
      console.log(dateArray);
      return dateArray;
  }

    CurrentSlide(data:any):any{
      this.SlideData=data;
    }
  dateFormat(date, format){
     var year = date.getFullYear();
     var month = this.months_n[date.getMonth()];
     var day = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
     return format.replace('y', year)
                  .replace('m', month)
                  .replace('d', day);
  }

  addDays(val, days) {
      var date = new Date(val.valueOf())
      date.setDate(date.getDate() + days);
      return date;
  }

  getCurrentDay(){
      var d=new Date();
      var day=d.getDate();
      return day;
  }
  ionViewDidLoad(){
     var now = new Date();
     now.setMonth(now.getMonth()+1);
     var lm = new Date();
     lm.setMonth(lm.getMonth()-2);
     this.getDates(new Date(this.dateFormat(lm, 'y-m-01')), new Date(this.dateFormat(now, 'y-m-01')));
     var c = this;
     this.plt.ready().then((readySource) => {
         
         var $ = jQuery;
         $(document).on('click', '.swiper-slide-prev', function () {
           c.slidePrev();
         }).on('click', '.swiper-slide-next', function () {
           c.slideNext();
         });
   
     });
  }

  slideChanged(){
    let currentDate = jQuery('.swiper-slide-active[data-date]').attr('data-date');
    console.log(currentDate);
    console.log('current date');
    this.currentDate=currentDate;
  }
 
  ionSlideDrag(){
    jQuery('.swiper-slide-prev').removeClass('swiper-slide-prev');
    jQuery('.swiper-slide-next').removeClass('swiper-slide-next');
    jQuery('.swiper-slide-active').removeClass('swiper-slide-active');
  }

  substractDate(date:any):number{
      var firstDate=new Date(date.replace(/-/g, "/"));
      var lastDate=new Date();
      var timedifference=Math.abs(firstDate.getTime()-lastDate.getTime());
      return Math.round(timedifference/(1000*3600*24));
  }
  slideNext(){
    this.slides.slideNext();
  }

  slidePrev(){
    this.slides.slidePrev();
  }
   
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }


  getNotification():void{
      this.service.getUrl('notification/lists',{},'get',true).subscribe(data=>{
          Promise.resolve(data).then(a=>{
              console.log(a.content)
              this.CurrentSlide(this.dateFormat(new Date(), 'y-m-d'));
              if(a.content)
                  this.list=a.content;
          });

      })
  }


  exeTapNotificationCmd(cmd:any,id:number):void{
      this.service.getUrl('notification/check/'+id,{},'get',true).subscribe(a=>{this.service.stopLoading();});
      let command=JSON.parse(cmd);
      if(command.open){
          if(command.id){
              this.events.publish('nav:push',this.pages[command.open],{id:command.id});
          }
      }
  }
}

