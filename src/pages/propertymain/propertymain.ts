import {ChangeDetectorRef, Component} from "@angular/core";
import {services} from "../../service/services";
import {AddPropertyMain} from "../AddPropertyMain/AddPropertyMain";
import {Events, NavController} from "ionic-angular";

interface propertymainInterface{
  loadSubCategory:(id:number)=>void;
  getCategory:()=>void;
  getSubCategory:()=>void;
  equal:(arg1:any,arg2:any)=>boolean;
  intFy:(input:any)=>number;
  startAddingProject:(input:any,parentInput:any)=>void;
}
@Component({
  selector:'propertymain',
  templateUrl:'propertymain.html',
  providers:[services]
})
export class propertymain implements propertymainInterface{
  type:string;
  private assetsUrl:string;
  category:Array<any>;
  SubCategory:Array<any>;
  private selectedMainCategory:number;
  constructor(public events:Events,public service:services,public change:ChangeDetectorRef, public navCtrl:NavController){
    this.type='Category';
    this.service.type=this.type;
    this.selectedMainCategory=0;
    this.assetsUrl=this.service.config.assetsDir;
    this.getCategory();
  }


  loadSubCategory(id:number):void{
    this.selectedMainCategory=id;
    this.change.detectChanges();
  }

  getSubCategory():void{
    this.service.getUrl('tools/lists?call=sub_category',{},'get',true).subscribe(data=>{
      this.service.type='SubCategory';
      return Promise.resolve(data).then(a=>{
        this.service.stopLoading();
        if(a.content) {
          try{
            this.SubCategory=a.content;
            this.change.detectChanges();
            console.log('available');
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

  startAddingProject(subcategory_id:any,category_id:any):void{
    this.events.publish('nav:push',AddPropertyMain,{id:this.intFy(subcategory_id),parentId:this.intFy(category_id)})
  }
  equal(arg1:any,arg2:any):boolean{
    if(this.intFy(arg1)===this.intFy(arg2))
      return true;
  }

  intFy(input:any):number{
    return parseInt(input);
  }

  getCategory():void{
      this.service.getUrl('tools/lists?call=category',{},'get',true).subscribe(data=>{
        return Promise.resolve(data).then(a=>{
          this.service.stopLoading();
          if(a.content) {
            try{
              this.category=a.content;
              this.change.detectChanges();
              this.getSubCategory();
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
