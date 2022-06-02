import {ChangeDetectorRef, Injectable} from "@angular/core";
import {Events} from "ionic-angular";
/**
 * Created by shadow-viper on 10/12/17.
 */





let websocketEndpoint='ec2-18-216-53-83.us-east-2.compute.amazonaws.com';
//let websocketEndpoint='barwaonline.com';
let websocketPort='5988';




@Injectable()
export class websocketServer{
    websocketInstance:any;
    token:string;
    Open:boolean;
    constructor(public events:Events){
        this.Open=false;
    }
    connectSocket():void{
        if(!this.IsSocketOpen())
            this.websocketInstance=new WebSocket('ws://'+websocketEndpoint+':'+websocketPort);
        console.log('connecting socket, please wait...')
    }

    startReceivingMessage():void{

        this.websocketInstance.onopen=(event)=>{
            console.log('receiving socket information ');
            console.log(event.data);
            this.events.publish('socket:open');
            this.Open=true;
        };
        this.websocketInstance.onmessage=(event)=>{
            console.log('receiving events from barwa websocket');
            console.log(event.data);
            this.events.publish('socket:broadcast',event.data);
        };
        this.websocketInstance.onclose=(event)=>{
            console.log('socket is now closing');
            this.Open=false;
            this.token=null;
            this.events.publish('socket:close',event);
        };
        this.websocketInstance.onerror=(event)=>{
            console.log('socket has error and now closing');
            this.Open=false;
        };
    }

    sendMessage(json:any):void{
        if(this.IsSocketOpen())
            this.websocketInstance.send(JSON.stringify(json));
    }


    authenticateWebsocket(token:string):void{
        if(this.IsSocketOpen() && !this.token)   {
            this.token=token;
            this.sendMessage({type:"Auth",content:{token:this.token}});
        }

    }
    IsSocketOpen():boolean{
        if(this.Open)
            return true;
    }
    close():void{
        this.websocketInstance.close();

    }
}

