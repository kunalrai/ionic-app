import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Events, Platform, MenuController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';

import {entry} from '../pages/entry/entry';
import {slider} from "../pages/slides/slides";
import {services} from "../service/services";
import {login} from "../pages/login/login";
import {Nav} from "ionic-angular";
import {paymentsBuildingPage} from "../pages/payments-building/payments-building";
import {documentsPage} from "../pages/documents/documents";
import {settingsPage} from "../pages/settings/settings";

import {dashboardPage} from "../pages/dashboard/dashboard";
import {invitationsPage} from "../pages/invitations/invitations";
import {notificationsPage} from "../pages/notifications/notifications";
import {Keyboard} from "@ionic-native/keyboard";
import {auth} from "../pages/auth/auth";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {splash1Page} from "../pages/splash/splash1";
import {websocketServer} from "../service/websocketService";
import {messages} from "../pages/messages/messages";
import {FCM} from '@ionic-native/fcm';
import {profile} from "../pages/profile/profile";
import {properties2} from "../pages/properties2/properties2";
let subscription = 0;

@Component({
    templateUrl: 'app.html',
    providers: [services]
})


export class MyApp {
    rootPage: any = splash1Page;
    hideMenuBars: boolean;
    @ViewChild(Nav) nav: Nav;
    Menu: any;
    push_token: string;

    constructor(private fcm: FCM,public socket: websocketServer, public service: services, keyboard: Keyboard, private orientation: ScreenOrientation, public change: ChangeDetectorRef, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, private menu: MenuController) {
        this.hideMenuBars = false;
        this.Menu = [];
        platform.ready().then(a => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //  storage.clear();


            //firebase push_token
            this.push_token = '';
            /* @@@@@@@@@@@@@@ subscribing to firebase marketting topic @@@@@@@@@@@@@@*/
            fcm.subscribeToTopic('marketing').then(()=>{
                console.log('firebase have successfully subscribed to the marketing topic');
            },error=>{
                console.error('unable to subscribe to firebase push notification topic marketing, please review');
                console.info(error);
            });

            //getting firebase push token
            fcm.getToken().then(token => {
                this.push_token = token;
                this.storage.set('push_token', token);
                console.log('firebase token success');
                console.log(token)
            },error=>{
                console.error('unable to get firebase token')
            });

            //Receiving push notification from firebase
            fcm.onNotification().subscribe(data => {
                if (data.wasTapped) {
                    //push notification is now tapped
                    if (data.info) {
                        if (data.info.type == 'Chat') {
                            //push notification is a chat push notification, lets open up chat message
                            this.nav.push(messages);
                        }
                    }
                } else {
                    console.log("Received in foreground");
                }
            },error=>{
                console.warn('firebase push notification is unable to receive notification');
                console.info(error);
            });

            //firebase is refreshing
            fcm.onTokenRefresh().subscribe(token => {
                this.push_token = token;
                this.storage.set('push_token', token);
            }, error => {
                console.log('firebase error, unable to initialize')
            });




            /* @@@@@@@@@@@@@@@@@@ System received session expired event from the api, we are cleaning up and login you out, SORRY@@@@@@@@@@@@@*/
            events.subscribe('session:expired', u => {
                console.warn('You are trying to login with an invalid authentication, Login you out, please login again');
                this.stopConnectingSocket();
                console.info('canceling chat request and socket communication');
                this.Menu = [];
                this.service.loaderMsg = 'Sign out requested or Token has expired!';
                this.service.change.detectChanges();
                console.info('revoking all access token on the local system');
                this.service.getUrl('auth/RevokeToken', {}, 'get', true).subscribe(a => {
                    console.log('token cleared from the server');
                    this.storage.clear().then(c => {
                        console.log('Local storage emptied database cleaned success');
                        this.nav.push(entry);
                    }, error => {
                        this.nav.push(entry);
                        console.error('cannot clear local database');
                        console.info(error);
                    })
                }, error => {
                    this.nav.push(entry);
                    console.error('unable to clear server token');
                    console.info(error);
                });

            });


            /* @@@@@@@@@@@@@@@@@@@@ System received a login request from the server, Please wait while i validate this request @@@@@@@@@@@@@@@@@@@@@*/
            events.subscribe('session:login', () => {
                //getting login token
               
                this.storage.get('login').then(a => {
                    //toggling menu item for either landlord or tenant
                    this.menuItems(a);

                    //start socket communication for chat etc
                    this.startWatchingEvents(this.events);
                })
            });




            /*@@@@@@@@@@@@@@@@@@@@@@@@ We are just loading the system for the first, Checking for existing valid user @@@@@@@@@@@@22*/
            setTimeout(() => {
                this.storage.get('login').then(a => {

                    try {
                        if (a.content) {
                            this.service.loaderMsg = 'Querying for a valid session!';
                            this.service.change.detectChanges();

                            //check if this token is still valid in the server
                            this.service.getUrl('auth/checkToken', {}, 'get', true).subscribe(data => {
                                Promise.resolve(data).then(d => {
                                    //token is available, toggling menu
                                    this.menuItems(a);


                                    //start listening to all socket and events
                                    this.startWatchingEvents(this.events);
                                })

                            }, error => {
                                console.error('Server rejected the session we found on local storage');
                                console.info(error);
                                this.nav.push(entry);
                                this.service.stopLoading();
                                this.change.detectChanges();
                            });
                        } else {
                            this.nav.push(entry);
                        }
                    } catch (e) {
                        this.nav.push(entry);
                    }
                    this.change.detectChanges();
                }, error => {
                    this.nav.push(entry);
                    this.change.detectChanges();
                });
            }, 2000);
            statusBar.styleDefault();
            statusBar.overlaysWebView(true);
            splashScreen.hide();
            keyboard.hideKeyboardAccessoryBar(false);
        });


        events.subscribe('nav:push',(view:any,param:{},StopRemoval:false)=>{
            this.nav.push(view, param)
                .then(() => {
                if(!StopRemoval){
                    // first we find the index of the current view controller:
                    const index = this.nav.getActive().index;
                    // then we remove it from the navigation stack
                    this.nav.remove(0,index);
                }

                });
            })
    }

    openPage(page) {
        if (page) {
            if (page !== auth) {
                this.menu.close();
                this.events.publish('nav:push',page,{id:0})
            } else {
                // logout
                this.menu.close();
                this.events.publish('session:expired')
            }
        }
    }

    menuItems(a) {
        if (a && a.content) {


            //menu information for landlords
            if (a.content.permission == 3) {
                this.Menu =
                    [
                        {name: 'home', icon: 'home.png', component: properties2},
                        {name: 'payments', icon: 'payments.png', component: paymentsBuildingPage},
                        {name: 'messages', icon: 'messages.png', component: messages},
                        {name: 'documents', icon: 'documents.png', component: documentsPage},
                        {name: 'dashboard', icon: 'dashboard.png', component: dashboardPage},
                        {name: 'settings', icon: 'settings.png', component: settingsPage},
                        {name: 'profile', icon: 'profile.png', component: profile},
                        {name: 'notifications', icon: 'notifications.png', component: notificationsPage},
                        {name: 'invitations', icon: 'invitations.png', component: invitationsPage},
                        {name: 'logout', icon: 'logout.png', component: auth},
                    ];
                if(a.content.is_first_login===0){
                    this.nav.push(properties2)
                }
                else{
                    this.nav.push(slider);
                }


            } else {

                //menu information for tenants
                this.Menu =
                    [
                        {name: 'home', icon: 'home.png', component: properties2},
                        {name: 'notifications', icon: 'notifications.png', component: notificationsPage},
                        {name: 'invitations', icon: 'invitations.png', component: invitationsPage},
                        {name: 'messages', icon: 'messages.png', component: messages},
                        {name: 'profile', icon: 'profile.png', component: profile},
                        {name: 'logout', icon: 'logout.png', component: auth},
                    ];
                this.nav.push(notificationsPage);

            }
            this.change.detectChanges();
        }
    }

    goBack() {
        if (this.nav.canGoBack()) this.nav.pop();
    }


    /* @@@@@@@@@@ now we are logged in, and we need to update the push token on the server @@@@@@@@@@@@@@@*/
    registerToken(): void {
        this.storage.get('push_token').then(data => {
            if (data && subscription == 0) {

                this.service.getUrl('PushNotification/register', {'token': data}, 'post', true).subscribe(r => {
                    console.log('Push token updated');
                    console.info(data);
                }, error => {
                    console.log(error);
                });
                subscription = 1;
                this.service.stopLoading();
            }
        })

    }



    //start listening to socket event
    startWatchingEvents(events: any) {
        let connectionTimeout = 0;
        this.socket.connectSocket();
        this.socket.startReceivingMessage();


        //token is now available, we need to authenticate socket
        events.subscribe('token:available', (token) => {
            console.log('websocket is trying to authenticate ');
            console.log(token);
            this.socket.authenticateWebsocket(token);
            this.registerToken();
        });


        //event received that socket needs to be reconnected
        events.subscribe('socket:reconnect', () => {
            if (connectionTimeout >= 5) {
                this.stopConnectingSocket();
                this.service.Alert('Socket', "Connection to barwa chat failed", ['Dismiss']);
            } else {
                this.socket.connectSocket();
                this.socket.startReceivingMessage();
                this.service.delay(() => {
                    events.publish('token:available', {});
                }, 2000);
                this.registerToken();
            }
            connectionTimeout = connectionTimeout + 1;
        });

        //event received to send information to the socket
        events.subscribe('socket:send', (evt) => {
            console.log('sending event to socket');
            this.socket.sendMessage(evt);
        });


        //event received that socket is now open, we need to try register push notification
        events.subscribe('socket:open', (evt) => {
            connectionTimeout = 0;
            this.registerToken();
            console.log('connection to websocket is now open');
        });

        //socket is closing, we will try reconnecting
        events.subscribe('socket:close', (evt) => {
            this.service.delay(() => {
                events.publish('socket:reconnect', {});
            }, 4000);
        });

    }


    //deattach all listeners from socket
    stopConnectingSocket() {
        this.events.unsubscribe('socket:reconnect');
        this.events.unsubscribe('socket:open');
        this.events.unsubscribe('socket:close');
        this.events.unsubscribe('socket:send');
        this.events.unsubscribe('token:available');
        this.socket.close();
    }

    countMenu(menu) {
        return menu.length > 0;
    }
}
