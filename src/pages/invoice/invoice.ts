import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Events, NavController, NavParams, Platform} from 'ionic-angular';

import { invoice1Page } from '../invoice1/invoice1';


import jQuery from 'jquery';
import {services} from "../../service/services";
import {properties} from "../properties/properties";

@Component({
  selector: 'page-invoice',
  host: { 'class': 'is-header2' },
  templateUrl: 'invoice.html',
    providers:[services]
})
export class invoicePage {
  header_data:any;
  days:number = 20;
  days_name:any;
  property_id:number;
  property:any;
  invoice_model:any;
  pastInvoice:any;
  invoice:any;
  invoice_Id:number;
  invoice_units:any;
  singleUnit:any;
  raisedVal:any;
  landlord:any;
  filds:any;
  raisedTo:any;
  raisedFrom:any;
  arrowType:string;
  constructor(public events:Events,public service:services,public change:ChangeDetectorRef,public navparam:NavParams,public navCtrl: NavController, public plt: Platform) {
      this.singleUnit={

      };
      let now=new Date();
      this.raisedVal=new Date(now.setDate(now.getDate()+1)).toISOString();
      this.raisedTo=new Date(now.setFullYear(now.getFullYear()+20)).getFullYear()+'-'+new Date(now.setFullYear(now.getFullYear()+20)).getMonth()+'-'+new Date(now.setFullYear(now.getFullYear()+20)).getDate();
      this.raisedFrom=new Date(now.setDate(now.getDate()+1)).getFullYear();
      console.log(this.raisedVal,this.raisedTo,this.raisedFrom);
      this.arrowType='ios-arrow-forward';

      this.landlord={};
    this.header_data = {
       title: 'Invoice',
       class: ''
     };
    this.pastInvoice=[];
    this.invoice_model={};
    this.filds={
        name:"Section Name",
        description:"",
        price:0
    };
      this.invoice={
          invoice: {
          },
          invitation:[],
          units:[],
          property:{
              property: {},
              image: [],
              property_unit: []
          },
          pastInvoice:[]
      };
      this.invoice_units=[];
      this.property=
          {
          property: {},
          image: [],
          property_unit: []
      };
      this.invoice_Id=0;
      this.header_data = { title:'Invoice',  class: '' };
      this.property_id=navparam.get('id');
      this.getPropertyInformation();
      var cnow = new Date();
      var months_n = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      var lm = new Date();
      lm.setMonth(lm.getMonth() + 8);
      this.getDates(new Date(cnow.getFullYear()+'-'+months_n[cnow.getMonth()]+'-01'), new Date(lm.getFullYear()+'-'+months_n[lm.getMonth()]+'-01'));
      this.invoice_model.recurring=false;
      this.jqueryInit();

  }


  addDays(val, days) {
      var date = new Date(val.valueOf())
      date.setDate(date.getDate() + days);
      return date;
  }
 
  getDates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
          var d = new Date (currentDate);
          var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          var now = new Date();
          var n_month = now.getMonth()+1;
          var c = currentDate.getFullYear()+'-'+currentDate.getMonth()+'-'+currentDate.getDate();
          var dnow = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate();
          if (c !== dnow) {
            var format = weekday[d.getDay()]+' '+(d.getDate() < 10 ? '0'+d.getDate() : d.getDate())+' '+months[d.getMonth()]+' '+d.getFullYear();
            //var format = weekday[d.getDay()]+' '+(d.getDate() < 10 ? '0'+d.getDate() : d.getDate())+' '+months[d.getMonth()]+' '+d.getFullYear();
          }else{
            var format = 'Today';
          }

          dateArray.push({name: format, val: d.getDate()});
          currentDate = this.addDays(currentDate, 1);
      }
      this.days_name = dateArray;
      console.log('date array');
      console.log(this.days_name);
      return dateArray;

  }



    getPropertyInformation():void {
        this.service.getUrl('invoice/list/'+this.property_id, {}, 'get', true).subscribe(data => {
            return Promise.resolve(data).then(a => {
                this.service.stopLoading();
                if (a.content) {
                    this.createinvoice();
                }
            })
        })
    }

    reloadInformation():void {
        this.service.getUrl('invoice/list/'+this.property_id, {}, 'get', true).subscribe(data => {
            return Promise.resolve(data).then(a => {
                this.service.stopLoading();
                if (a.content) {
                    console.log(a.content);
                    try {
                       this.populateSystem(a);
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
        })
    }


  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }


  createUnit():void{
          this.service.getUrl('invoice/createUnit/'+this.invoice_Id, this.filds, 'post', true).subscribe(data => {
              return Promise.resolve(data).then(a => {
                  this.service.stopLoading();
                  //this.AddSection();
                  this.reloadInformation()
                  if (a.content) {
                      console.log(a.content);
                  }
              })
          },error=>{
              console.error(error);
              this.service.Alert('Invoice unit', error.statusText,['Dismiss']);
          })

  }


  deleteUnit(id:any):void{
      this.service.Alert('invoice','Do you really want to delete this unit?', [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Delete',
                  handler: () => {
                      this.service.getUrl('invoice/removeUnit/'+id, {}, 'get', true).subscribe(data => {
                          this.reloadInformation()
                      },error=>{
                          this.service.Alert('invoice',error.statusText,['Dismiss']);
                      })
                  }
              }
          ]
      );

      }
  populateSystem(a:any):void{
      if(a.content.property)
          this.property = a.content.property;
      if(a.content.pastInvoice)
          this.pastInvoice=a.content.pastInvoice;
      if(a.content.units)
          this.invoice_units=a.content.units;
      if(a.content.invoice[0]){
          this.invoice_Id=a.content.invoice[0].id;
          this.invoice_model=a.content.invoice[0];
          this.invoice_model.endDays=this.service.getDateBack(new Date(),this.invoice_model.invoiceDue)['d'];
      }

      if(a.content.landlord[0]){
          this.landlord=a.content.landlord[0];
      }
      console.log(a);
  }
  createinvoice():void{

                  let datestring = new Date();
                  let invoiceData = {
                      name: 'generated ' + datestring.toDateString(),
                      description: 'generated invoice for property ' + this.property.property.property_name + ' on ' + datestring.toDateString(),
                      invoiceDue: 30,
                      price: 0,
                      to: 0,
                      property: this.property_id
                  };
                  this.service.type = 'invoice_create';
                  this.service.getUrl('invoice/create', invoiceData, 'post', true).subscribe(data => {
                      return Promise.resolve(data).then(a => {
                          this.service.stopLoading();
                          if (a.content) {
                              console.log(a.content);
                              this.invoice_Id = a.content.id;
                              this.reloadInformation();
                          }
                      })
                  }, error => {
                      console.error(error);
                      this.reloadInformation();

                  })

  }


  updateInvoice():void{   this.service.Alert('invoice','You cannot be able to edit this invoice after you have raised it, Do you really want to update and raise this invoice?', [
    {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
            console.log('Cancel clicked');
        }
    },
    {
        text: 'Raise',
        handler: () => {

            this.change.detectChanges();
      this.invoice_model.invoiceDue=this.service.getDateBack(new Date(),new Date(this.raisedVal))['d']<0?30:this.service.getDateBack(new Date(),new Date(this.raisedVal))['d'];
    //  if(this.invoice_model.invoiceDue>0){
      this.service.getUrl('invoice/update/'+this.invoice_Id, {
          invoiceDue:this.invoice_model.invoiceDue,
          price:this.totalInvoice(),
          recurring:this.invoice_model.recurring,
          rduration:this.invoice_model.rduration
      }, 'post', true).subscribe(data => {
          return Promise.resolve(data).then(a => {
              this.service.stopLoading();
              console.log('invoice update success');
              console.log(a);
                  this.raiseInvoice();
          })
      },error=>{
          console.log(error);
          this.service.Alert('Invoice',error.statusText,['Dismiss']);
          this.service.Alert('Invoice','There was an error while trying to update invoice, please correct them before raising invoice',['Dismiss']);
      })
  //    }else{
    //      this.service.Alert('Invoice','Please choose a different date instead of today',['Dismiss']);
    //  }
        }}])
      }

  raiseInvoice=():void=>{
        console.log('I am inside raise invoice function');
          this.service.getUrl('invoice/Raise/'+this.invoice_Id, {}, 'get', true).subscribe(data => {
              return Promise.resolve(data).then(a => {
                  this.service.stopLoading();
                  console.log('invoice raised');
                  console.log(a);
                  if (a.content) {
                      this.events.publish('nav:push',properties,{id:this.property_id});
                      this.service.Alert('Invoice','Invoice raised successfully...',['Dismiss']);
                  }
              })
          },error=>{
              console.error(error);
              this.service.Alert('Invoice',error.statusText,['Dismiss']);
          })
  }


  jqueryInit():void{
    console.log('I am getting called on page load of jqueryInit');

      this.plt.ready().then((readySource) => {
          let $ = jQuery;
          $(document).on('click', '.gb .gb-item', function () {
              $('.gb .gb-item').removeClass('active');
              $(this).addClass('active');
          });
          //I am uncommenting this section real quick
/*
          $(document).ready(function () {
              $('body').append(`
               <script>
       
      function getIndexForValue(elem, value) {
          for (var i=0; i<elem.options.length; i++)
              if (elem.options[i].value == value)
                  return i;
      }

      function pad(number) {
          if ( number < 10 ) {
              return '0' + number;
          }
          return number;
      }

      function update(datetime) {
          $("#date").drum('setIndex', datetime.getDate());

           }

      $(document).ready(function () {
          $("select.date").drum({
              onChange : function (elem) {
                  var arr = {'date' : 'setDate'};
                  var date = new Date();
                  for (var s in arr) {
                      var i = ($("form[name='date'] select[name='" + s + "']"))[0].value;
                      eval ("date." + arr[s] + "(" + i + ")");
                  }
                  date.setSeconds(0);
                  update(date);

                  var format =( date.getDate() );

                  $('.date_header .selection').html(format);
              }
          });
          update(new Date());
      });

               </script>
              `);
          });
          */

      });

  }

    changeDate(id:number):void{
      if(id==1){
          this.invoice_model.rduration='weekly';
      }else if(id==2){
          this.invoice_model.rduration='biweekly';
      }else{
          this.invoice_model.rduration='monthly';
      }
    }
  AddSection():void{
      if(this.filds.name.length>0 && this.filds.price>0){
          this.invoice_units.push(this.filds);
          this.filds={
              name:"Section Name",
              description:"",
              price:0
          };
      }else{
          this.service.Alert('Invalid input','Invalid input, Please check and try again!',['Dismiss']);
      }
  }

  totalInvoice():number{
      let total=0;
      for(var i in this.invoice_units){
          total+=this.invoice_units[i].price |0;
      }
      return total;
  }

    plus(){
        this.filds.price += 1;
    }
    minus(){
        if (this.filds.price > 0) {
            this.filds.price -= 1;
        }
    }

    PayInvoice(){

    }


    getMonths(days:number){
        return (days|0)>30?Math.ceil((days|0)/30)+' Month(s)':days+' Day(s)';
    }
}

