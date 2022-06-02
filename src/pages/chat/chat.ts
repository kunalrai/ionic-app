import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Events, NavController, NavParams, Platform} from 'ionic-angular';
import {services} from "../../service/services";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {messages} from "../messages/messages";


@Component({
  selector: 'page-chat',
  host: { 'class': 'is-header2' },
  templateUrl: 'chat.html',
    providers:[services]
})
export class chat implements OnInit{
  @ViewChild('fileInp') fileInput: ElementRef;
  file:any;
    header_data:any;
  message_height:any;
  chatId:number;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    messages:Array<any>;
    formValues:any;
  modal = [{
    id: 'modal-option',
    display: 'hidden'
  },
  {
    id: 'modal-service-request',
    display: 'hidden'
  }];
  ServiceRequests = [
    {name: 'Water Bill', class: ''},
    {name: 'Yearly Maintainance', class: ''},
    {name: 'Wall Painting', class: ''},
    {name: 'Furniture Repair', class: 'active'},
    {name: 'Lift Maintainance', class: ''},
    {name: 'Parking', class: ''},
  ];
  user:any;
  receiversTyping:boolean;
  account:any;

  constructor(public browser:InAppBrowser,public events:Events, public service:services,public navCtrl: NavController, public plt: Platform,public navparam:NavParams,public change:ChangeDetectorRef) {

      this.user={};

     this.formValues={
         chatInput:''
     };
     this.user=this.navparam.get('user');
     console.log(this.user)
     plt.ready().then((readySource) => {
      if(plt._platforms[1] == "android"){
       this.message_height = plt.height()-125;
      }else{
       this.message_height = plt.height()-120;
      }
     });

     this.account={};
     this.messages = [

     ];
     this.receiversTyping=false;
  }

  ngOnInit(){
      if(!this.user.id){
          this.service.Alert('System','No user selected for chat, Please select a user',['Dismiss']);
          this.events.publish('nav:push',messages);
          return;
      }
      this.incomingData();
      this.send({type:"OpenChat",content:{"id":this.user.id}})
  }

  dateFormat(date) {
      date = new Date(date);
  
      var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      var strDate = "";
  
      var today = new Date();
      today.setHours(0, 0, 0, 0);
  
      var yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);
  
      var tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      if (today.getTime() == date.getTime()) {
          strDate = "Today";
      } else if (yesterday.getTime() == date.getTime()) {
          strDate = "Yesterday";
      } else {
          strDate = date.getHours()+':'+date.getMinutes()+'   '+date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear().toString().substr(-2);
      }
  
      return strDate;
  }

  transferFile():void{
      this.service.type="chatFileTransfer";
      this.service.loading('System','Transfer please wait...');
      this.service.sendFiles('tools/documents?call=chat&call_id='+this.chatId+'&to='+this.user.id,this.file).subscribe(a=>{
          this.send({type:"File",content:{message:a.content.shortLocation,ext:a.content.extension,extFamily:a.content.extFamily,name:a.content.realName}});
          this.service.stopLoading();
          this.closeModal();
      },error=>{
          this.service.Alert('System','File could not be transferred',['Dismiss']);
      })

  }
  fileUpload(event) {
    this.file=event.srcElement.files[0];
    this.transferFile();
  }


  serviceSelected(s){
    this.modal[1].display = 'hidden';
    for (var i in this.ServiceRequests){
      this.ServiceRequests[i].class = '';
    }
    s.class = 'active'; 
    // Todo
      this.request(s.name);
  }

  closeModal(){
      for (var x in this.modal){
          this.modal[x].display = 'hidden';
      }
  }
  openModal(i){
    for (var x in this.modal){
      this.modal[x].display = 'hidden';
    }
    this.modal[i].display = 'block'; 
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }
 
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }


  command(id:number):void{

    }


    addMessage(message:any):void{
        console.log('checking if message ==array');
        console.log(message);
        if(Array.isArray(message)){
            for(let i in message){
                if(this.user.id==message[i].to || this.user.id==message[i].from) {
                    this.messages.push(message[i])
                }
            }
        }else{
            this.messages.push(message);
        }
        this.service.stopLoading();
    }

  send(data:any):void{
      this.events.publish('socket:send',data);
  }

  incomingData():any{
      this.messages = [];
      this.events.subscribe('socket:broadcast', (message) => {
          message = JSON.parse(message);
          console.log(message);
          if(message.type=='command') {
              this.command(message.content.command);
          }else if (message.type=='Typing') {
              if (message.content.id == this.user.id) {
                  this.receiveTyping();
              }
          }else if(message.type=='Chat'){
              if(this.user.id){
                  this.addMessage(message.content);
              }
          }else if(message.type=='Account'){
              this.account= message.content;
          }else if(message.type=='System'){
              if(message.content.notification){
                  this.service.Alert('Chat',message.content.notification,['Dismiss']);
              }else if(message.content.loader){
                  this.service.loading('System',message.content.loader);
              }else if(message.content.id>0 && message.content.debug){
                  this.chatId=message.content.id;
              }
          }
          this.change.detectChanges();
      })
  }


    receiveTyping():void{
        if(!this.receiversTyping)
            this.receiversTyping=true;
        this.service.delay(()=>{
            this.receiversTyping=false;
        },3000);
    }

    thumb(imageLink:string):string{
      if(imageLink){
          let imageparts=imageLink.split('.');
          imageLink='';
          for(let i=0; i<imageparts.length; i++){
              if(i==imageparts.length-1){
                  imageLink+='_thumb.jpg';
              }else{
                  if(imageLink==''){
                      imageLink+=imageparts[i];
                  }else{
                      imageLink+='.'+imageparts[i];
                  }

              }
          }
          return this.service.Link(imageLink);
      }
    }

    typing():void{
        this.send({type:"Typing",content:{}})
    }

    request(type:string):void{
      this.closeModal();
      this.send({type:"Request",content:{message:type}});
    }

    chatform():void{
        if(this.formValues.chatInput){
            this.send({type:"Chat",content:{message:this.formValues.chatInput}});
            this.formValues.chatInput='';
        }
    }

    userAvatar(previous:any,current:any):any{
      if(!previous){
          if(current.from==this.account.id){
              return this.service.Link(this.account.image_path);
          }else{
              return this.service.Link(this.user.image_path);
          }
      }else{
          if(previous.from!=current.from){
              if(current.from==this.account.id){
                  return this.service.Link(this.account.image_path);
              }else{
                  return this.service.Link(this.user.image_path);
              }
          }else{
              return '';
          }
      }
    }


    downloadFile(type:string,url:string):void{
      if(type=='file'){
          let fileUrl=this.service.Link(url);
          this.browser.create(fileUrl);

      }
    }

}

