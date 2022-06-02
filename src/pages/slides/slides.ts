import {Component, ViewChild} from "@angular/core";
import {Events, NavController, Slides} from "ionic-angular";
import {Config} from "../../app/Config";
import {services} from "../../service/services";
import {propertymain} from "../propertymain/propertymain";
import {AddPropertyMain} from "../AddPropertyMain/AddPropertyMain";

@Component({
  selector:'page-intro1',
  templateUrl:'slides.html',
  providers:[services]
})

export class slider{
  @ViewChild(Slides) slides:Slides;
  pages:{
    selectType:any
  }
  items:Array<any>;
  constructor(public events:Events,private navCtrl:NavController,public service:services){
    this.pages={
      selectType:AddPropertyMain
    };
    this.items=[{
      bg:'purple',
      image:this.service.config.assetsDir+'house.png',
      Title:'Welcome to EasyRent',
      subTitle:"Start adding your properties to one of the best rental app"
    },{
      bg:'dark',
      image:this.service.config.assetsDir+'hand.png',
      Title:'Manage Payments',
      subTitle:"Make your payments easily"
    }];

  }



  slideNext(){
    if(this.slides.isEnd()){
      this.events.publish('nav:push',AddPropertyMain);
    }else{
      this.slides.slideNext();
    }
  }
  slidesDidChange(){
    let currentIndex=this.slides.getActiveIndex();
    console.log('slides current index is '+currentIndex)
  }
}
