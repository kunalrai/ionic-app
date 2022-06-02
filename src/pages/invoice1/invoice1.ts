import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import jQuery from 'jquery';

@Component({
  selector: 'page-invoice1',
  host: { 'class': 'is-header2' },
  templateUrl: 'invoice1.html', 
})
export class invoice1Page {
  header_data:any;

  days:number = 20;
  days_name:any;

  filds = {
     'flatFloor': 10,
  };

  constructor(public navCtrl: NavController, public plt: Platform) {
    this.header_data = { title: 'Invoice',  class: '' };
  	this.plt.ready().then((readySource) => {

  	  var $ = jQuery;
      $(document).on('click', '.gb .gb-item', function () {
      	$('.gb .gb-item').removeClass('active');
      	$(this).addClass('active');
      });

       $(document).ready(function () {
         $('body').append(`
            <script>
           //   $("select.date-picker").drum();
            </script>
           `);
      });

      var cnow = new Date();
      var months_n = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      var lm = new Date();
      lm.setMonth(lm.getMonth() + 1);

      this.getDates(new Date(cnow.getFullYear()+'-'+months_n[cnow.getMonth()]+'-01'), new Date(lm.getFullYear()+'-'+months_n[lm.getMonth()]+'-01'));

  	 });
  }

  addDays(val, days) {
      var date = new Date(val.valueOf())
      date.setDate(date.getDate() + days);
      return date;
  }

  plus(){
     this.filds.flatFloor += 1;
  }
  minus(){
     if (this.filds.flatFloor > 0) {
       this.filds.flatFloor -= 1;
     }
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
            var format = weekday[d.getDay()]+' '+(d.getDate() < 10 ? '0'+d.getDate() : d.getDate())+' '+months[d.getMonth()];
          }else{
            var format = 'Today';
          }
          dateArray.push({name: format, val: d.getDate()});
          currentDate = this.addDays(currentDate, 1);
      }
      this.days_name = dateArray;
      return dateArray;
  }
 
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
 
   
}

