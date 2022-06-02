import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-dashboard',
  host: { 'class': 'is-header2' },
  templateUrl: 'dashboard.html',
})
export class dashboardPage {
  header_data:any;
  constructor(public navCtrl: NavController) {
    this.header_data = {
        title: 'Dashboard', 
        class: ''
    };
  	this.options = {
  		    legend: {
              enabled: false,
            },
            credits: {
              enabled: false
            },
            chart: {
              marginTop: 10, 
            },
            xAxis: { 
               lineColor: false,
               tickColor: false,
               tickWidth: 0,
               gridLineColor: false,
               gridLineWidth: 0,
               crosshair: true,
               minorGridLineColor: false,
               categories: ["Mar","Apr","May","Jun","Jul","Aug","Sep"],
               labels: {
               	y: 40
               }
            },
            yAxis: {
               title: {
                 text: null
               }, 
               lineWidth: 0,
               tickWidth: 0, 
               gridLineColor: '#eaeaea', 
               tickInterval: 2, 
               labels: {
               	formatter: function() {
                  return this.value.toFixed(1)+'k'
                },
               }
            },
            title : { text : null },
            tooltip: {
              useHTML: true,
              formatter: function () {
                var a =  '<div style="color:rgb(124,181,236);">'+this.x+'</div>';
                a +=  this.series.name+' : <b>'+ this.y+'k' +'</b>';
                return a;
              }
            },
            plotOptions: { 
               series: {
                   lineWidth: 1.5, 
                   dataGrouping: {
                       enabled: false
                   },
               }, 
            },
            series: [{
                name: 'Ending Balance',
                data: [ 0, 9, 10, 13.5, 12, null, null], 
            }]
        };
  }
  options: Object;
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

