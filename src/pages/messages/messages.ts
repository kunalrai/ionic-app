import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, Platform} from 'ionic-angular';
import {services} from "../../service/services";
import {chat} from "../chat/chat";
 
 
@Component({
  selector: 'page-messages',
  host: { 'class': 'is-header2' },
  templateUrl: 'messages.html',
    providers:[services]
})
export class messages implements OnInit {

    header_data: any;
    filterVal:any='both';
    messages: Array<any>;
    Online: any;
    tabs: any = [
        {name: 'All', class: 'active', target: '',id:'both'},
        {name: 'Unread', class: '', target: '',id:0},
        {name: 'Favorites', class: '', target: '',id:2},
    ];

    constructor(public navCtrl: NavController, public plt: Platform, public events: Events, public service: services, public change: ChangeDetectorRef) {
        this.header_data = {
            title: 'Messages',
            class: ''
        };
        this.Online = [];
        this.messages = [];

    }


    addUser(users: any): void {
        console.log('checking if user ==array');
        console.log(users);
        if (Array.isArray(users)) {
            for (let i in users) {
                if (!this.service.existsInId(this.messages, users[i].id)) {
                    this.messages.push(users[i])
                }
            }
        } else {
            if (!this.service.existsInId(this.messages, users.id)) {
                this.messages.push(users);
            }
        }
        console.log('users json');
        console.log(this.messages);
    }

    ngOnInit(): any {
        this.getcontacts();
        this.messages = [];
        this.events.subscribe('socket:broadcast', (message) => {
            message = JSON.parse(message);
            if (message.type == 'Users') {
                console.log('user data is coming around');
                console.log(message);
                this.addUser(message.content);
            } else if (message.type == 'Status') {
                console.log('users status');
                console.log(message.content)
                this.Online = message.content.users;
            }
            this.change.detectChanges();
        })
    }

    isOnline(id: number): boolean {
        if (id > 0) {
            for (let i in this.Online){
                if (this.Online[i] == id.toString())
                    return true;
        }
}
    }

  Tabs(tab){
    for (var i in this.tabs) {
       this.tabs[i].class = '';
    }
    tab.class = 'active';
    this.filterVal=tab.id;
    // Todo
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }




    getcontacts():void{
      this.events.publish('socket:send',{type:'PreviousChat',content:{}});
        this.events.subscribe('socket:open',(token)=>{
            this.service.loading('reconnecting','Reconnecting please wait...');
            this.service.delay(()=>{
                this.events.publish('socket:send',{type:'PreviousChat',content:{}});
                this.service.stopLoading();
            },4000)
        });
        }

  openChat(user:any):void{
      user.title=user.receiverName;
      user.class='';
      this.events.publish('nav:push',chat,{user:user});
  }
}

