import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {geolocation, searchService, services} from "../../service/services";
import {Events, NavController,Platform} from "ionic-angular";
import {previousProperty} from "../previousProperty/previousProperty";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AutoCompleteComponent} from "ionic2-auto-complete";
import {properties2} from "../properties2/properties2";

interface AddPropertyMainInterface{
  SortCategory:()=>void;
  getSubCategory:()=>void;
  intFy:(input:any)=>number;
  equal:(arg1:any,arg2:any)=>boolean;
  ChangeSelection:(input:number)=>void;
  createProperty:(type:number)=>void;
  uploadFiles:(propertyId:number)=>void;
  removeFile:(fileId:any)=>void
  addFile:(event:any)=>void;
}
@Component({
  selector: 'page-add-property',
  templateUrl:"AddPropertyMain.html",
  providers:[services,geolocation,searchService]
})
export class AddPropertyMain implements AddPropertyMainInterface{
  @ViewChild('address')
  address: AutoCompleteComponent;
  @ViewChild('address2')
  address2: AutoCompleteComponent;
  @ViewChild('city')
  city: AutoCompleteComponent;
  @ViewChild('address1')
  address1: AutoCompleteComponent;
  @ViewChild('address12')
  address12: AutoCompleteComponent;
  @ViewChild('city1')
  city1: AutoCompleteComponent;

  type:string;
  waitInput:boolean;
  show:{
    address:boolean,
    city:boolean,
    pincode:boolean,
    address2:boolean;
  };
  propertySubCategory:{id:number,parentId:number };
  SubCategory:Array<any>;
  SubDisplayCategory:Array<any>;
  files:any;
  path:Array<{name:string,url:string}>;
  tranferred:Array<any>;
  fileremain:number;
  properties2:any;
  properties:any;
  property:{
    property_name:string;
    property_unique:string;
    property_floors:number;
    property_units:number;
    property_area:string;
    property_prefix:string,
    address:string;
    address2:string;
    city:string;
    pincode:number,
    amount:number,
    category:number
  };
  selected:boolean;
  header_data:object;
  constructor(public events:Events,public platform:Platform,public search:searchService,public navCtrl:NavController,public change:ChangeDetectorRef,public service:services,public geo:geolocation) {
    this.header_data = { title: 'Add Property',  class: '' };

    this.type = 'AddProperty';
    this.service.type = this.type;
    this.propertySubCategory = {
      id: 1,
      parentId: 1

    };
    this.waitInput=true;
    this.SubCategory=[];
    this.SubDisplayCategory=[];
    this.getSubCategory();
    this.property={
      property_name:'',
      property_unique:'',
      property_floors:10,
      property_units:1,
      property_area:'',
      address:'',
      property_prefix:'',
      address2:'',
      city:'',
      pincode:null,
      amount:null,
      category:this.propertySubCategory.id
    };
    this.show={
      address:false,
      city:false,
      address2:false,
      pincode:false
    };
    this.properties=new FormGroup({
      property_name:new FormControl(this.property.property_name,[Validators.minLength(3),Validators.required]),
      property_unique:new FormControl(this.property.property_unique),
      pincode:new FormControl(this.property.pincode),
      property_floors:new FormControl(this.property.property_floors,[Validators.required]),
      property_units:new FormControl(this.property.property_units,[Validators.required]),
      property_area:new FormControl(this.property.property_area,[Validators.required]),
      amount:new FormControl(this.property.amount,[Validators.required]),
      category:new FormControl(this.property.category,[Validators.required])
    });
    this.properties2=new FormGroup({
      property_name:new FormControl(this.property.property_name,[Validators.minLength(3),Validators.required]),
      property_unique:new FormControl(this.property.property_unique),
      pincode:new FormControl(this.property.pincode),
      property_floors:new FormControl(this.property.property_floors,[Validators.required]),
      property_prefix:new FormControl(this.property.property_prefix,[Validators.required]),
      property_units:new FormControl(this.property.property_units,[Validators.required]),
      property_area:new FormControl(this.property.property_area,[Validators.required]),
      amount:new FormControl(this.property.amount,[Validators.required]),
      category:new FormControl(this.property.category,[Validators.required])
    });
    this.path=[];
    this.files=[];
    this.tranferred=[];
    this.service.emit.subscribe(value=>{
      console.log(value);
    });
    this.selected = false;

    this.service.initializeToken();
  }

  ngOnInit(){
    this.geo.getLocationJson().then((a)=>{
      this.service.delay(()=>{this.setGeolocationInputs(a);},2000);
      console.log(a);
    },reject=>{
      console.error(reject);
    });
  }
  setGeolocationInputs(a:any):void{
    this.properties.controls['pincode'].setValue(a.zip);
    this.address.setValue(a.address);
    this.address2.setValue(a.address2);
    this.address12.setValue(a.address2);
    this.city.setValue(a.state);
    this.address1.setValue(a.address);
    this.city1.setValue(a.state);
    this.properties2.controls['pincode'].setValue(a.zip);
    this.change.detectChanges();
  }
  SortCategory():void{
    if(this.SubCategory){
      for(var i in this.SubCategory){
        if(this.intFy(this.SubCategory[i].category_id)==this.propertySubCategory.parentId){
          this.SubDisplayCategory.push(this.SubCategory[i]);
        }
      }
      this.change.detectChanges();
      console.log(this.SubDisplayCategory);
    }
  }

  itemSelected(event:any):void{
    console.log(event);
    let geolocationAddress=this.geo.arrangeAddress([event]);
    console.log(geolocationAddress);
    this.setGeolocationInputs(geolocationAddress);
  }


  ChangeSelection(selectionId:number):void{
    if(this.propertySubCategory.id){
      this.propertySubCategory.id=selectionId;
      this.property.category=selectionId;
    }
  }
  equal(arg1:any,arg2:any):boolean{
    if(this.intFy(arg1)===this.intFy(arg2))
      return true;
  }


  getSubCategory():void{
    this.service.getUrl('tools/lists?call=sub_category',{},'get',true).subscribe(data=>{
      this.service.type='SubCategory';
      return Promise.resolve(data).then(a=>{
        console.log('got category');
        this.service.stopLoading();
        console.log(a);
        if(a.content) {
          try{
            this.SubCategory=a.content;
            console.log('categories received');
            this.change.detectChanges();
            console.log('sort called on contents');
            this.SortCategory();
            console.log('available');
          }catch(e){
            console.error(e);
          }
        }
      })
    },error=>{
      try{
        this.service.stopLoading();
       // this.service.Alert(this.type,error.statusText,['Dismiss']);
      }catch(e){}
    })
  }


  intFy(input:any):number{
    return parseInt(input);
  }

  createProperty(type:number):void{
    //if(this.files.length>0){
    if(type==1){
      this.property=this.properties2.value;
      this.property.address=this.address1.getValue();
      this.property.city=this.city1.getValue();
      this.property.address2=this.address12.getValue();
    }else{
      this.property=this.properties.value;
      this.property.address=this.address.getValue();
      this.property.city=this.city.getValue();
      this.property.address2=this.address2.getValue();
    }
    this.property.category=this.propertySubCategory.id;
    console.log(this.property);
    if(this.property.category && this.property.property_name && this.property.address && this.property.city){
      this.service.getUrl('property/create',this.property,'post',true).subscribe(data=>{

        console.log(data);
        this.service.type='CreateProject';
        return Promise.resolve(data).then(a=>{
          this.service.stopLoading();
          if(a.content) {
            try{
              if(a.content.id){
                console.log(this.files.length)
                if(this.files.length>0) {
                  this.service.loading(this.service.type, a.statusText);
                  this.uploadFiles(this.intFy(a.content.id));
                }else{
                  this.successTransfer(a.content.id);
                }
              }
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
    }else{
      this.service.Alert(this.type,"Please fill the required fields",['Dismiss']);
    }
    // }else{
    //    this.service.Alert(this.type,"An image is needed to create a project",['Dismiss']);
    // }

  }


  setTransferFiles(counter:number):void{
    this.tranferred.push(this.files[counter]);
    this.files.splice(counter-1,1);
  }

  getTransferedFiles():Array<any>{
    return this.tranferred;
  }

  previous(){
    this.events.publish('nav:push',previousProperty, {id:1});
  }

  successTransfer(propertyId:number){
    this.service.Alert('File Transfer','All files transferred successfully',['Dismiss']);
    if(this.property.category==2){
      this.events.publish('nav:push',properties2,{id:propertyId})

    }else{
      this.events.publish('nav:push',previousProperty, {id: propertyId});
    }
    this.service.stopLoading();
  }
  uploadFiles(propertyId:number):void{
    let fileLength=this.files.length;
    this.fileremain=0;
    if(this.files.length>0){
      this.service.loading('File Transfer','File transfer in progress, Please wait ...');
      for(var i=0; i<this.files.length; i++){
        // this.service.getFileEntry('tools/upload/'+propertyId+'?call=property',this.files[i],fileLength).then((a)=>{
        this.service.sendFiles('tools/upload/'+propertyId+'?call=property',this.files[i]).subscribe(a=>{
          if(this.fileremain>=fileLength-1){
            this.successTransfer(propertyId);
          }
          this.fileremain++;
        },error=>{
          if(error){
            this.service.Alert(this.type,error.statusText,['Dismiss']);
          }else{
            this.service.Alert(this.type,'Transfer failed',['Dismiss']);
          }
          console.log(error);
          if(this.fileremain>=fileLength-1){
            this.successTransfer(propertyId);
          }
          this.fileremain++;
        })
      }
    }else{
      this.service.Alert(this.type,"No File added",['Dismiss']);
    }
  }


  addFile($event:any):void{
    for(var i in $event.target.files){
      let newfile=$event.target.files[i];
      try{
        var url=URL.createObjectURL(newfile);
        this.path.push({name:newfile.name,url:url});
        this.change.detectChanges();
        this.files.push(newfile);
      }catch(e){
      }

    }}

  removeFile(filename:string):void{
    this.service.Alert('Delete','Do you really want to delete this image?', [
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
              if(filename){
                for(var i in this.files){
                  if(this.files[i].name==filename){
                    this.files.splice(i,1);
                    break;
                  }
                }
                for(var l=0; l< this.path.length; l++){
                  if(this.path[l].name==filename){
                    this.path.splice(l,1);
                    break;
                  }
                }
                this.change.detectChanges();
                console.log(this.files);
                console.log(this.path);
              }
            }
          }
        ]
    );

  }

  propertyTypes =
      [{
        data: {img: 'apartment1@2x.png', text: 'Residential', class: 'icon-btn', id: 'residential'},
        sub: [
          {data: {img: 'house@2x.png', text: 'Individual', class: 'icon-btn'}, display: 'none',dId:1},
          {data: {img: 'apartment@2x.png', text: 'Apartment', class: 'icon-btn'}, display: 'none',dId:2},
        ],
        display: 'none',
      },
        {
          data: {img: 'office-block@2x.png', text: 'Commercial', class: 'icon-btn'},
          sub: [
            {data: {img: 'online-shop@2x.png', text: 'Store', class: 'icon-btn'}, display: 'none',dId:3},
            {data: {img: 'warehouse@2x.png', text: 'Warehouse', class: 'icon-btn'}, display: 'none',dId:4},
          ],
          display: 'none',
        },
        {
          data: {img: 'factory@2x.png', text: 'Industrial', class: 'icon-btn'},
          sub: [
            {data: {img: 'warehouse@2x.png', text: 'Warehouse', class: 'icon-btn'}, display: 'none',dId:5},
            {data: {img: 'factory-1@2x.png', text: 'Manfucaturers', class: 'icon-btn'}, display: 'none',dId:6},
            {data: {img: 'online-shop@2x.png', text: 'Store', class: 'icon-btn'}, display: 'none',dId:7},
          ],
          display: 'none',
        }
      ];


  filds = {
    'flatFloor': 10,
  };


  tab(pt, type, s,id){
    if (type == 1) {
      this.propertySubCategory.parentId=id;
      for (var i in this.propertyTypes){
        this.propertyTypes[i].data.class = this.propertyTypes[i].data.class.replace(/active/g, '');
        this.propertyTypes[i].display = 'none';
      }
      pt.data.class += ' active';
      pt.display = 'block';
      this.selected = false;

    }else{
      this.propertySubCategory.id=id;
      for (var i in this.propertyTypes[s].sub){
        this.propertyTypes[s].sub[i].data.class = this.propertyTypes[s].sub[i].data.class.replace(/active/g, '');
        this.propertyTypes[s].sub[i].display = 'none';
      }
      pt.data.class += ' active';
      pt.display = 'block';
      this.selected = true;

    }
    console.log(pt,type,s,id);
    console.log(this.propertySubCategory);
  }

  plus(){
    this.properties2.controls['property_units'].setValue(this.properties2.controls['property_units'].value+1);
  }
  minus(){
    if (this.filds.flatFloor > 0) {
     this.properties2.controls['property_units'].setValue(this.properties2.controls['property_units'].value- 1);
    }
  }

  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop();
  }
}