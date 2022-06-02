import {NgModule, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {entry} from '../pages/entry/entry';
import {auth} from '../pages/auth/auth';
import {login} from '../pages/login/login';
import {signup} from '../pages/signup/signup';
import {otp} from '../pages/otp/otp';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {created} from "../pages/created/created";
import {slider} from "../pages/slides/slides";
import {HttpModule} from "@angular/http";
import {IonicStorageModule} from "@ionic/storage";
import {FormsModule} from "@angular/forms";
import {resetinitiate} from "../pages/resetInitiate/resetinitiate";
import {resetpassword} from "../pages/resetpassword/resetpassword";
import {resetconfirmation} from "../pages/resetconfirmation/resetconfirmation";
import {
  CutPipe, SafeUrlPipe, searchPipe, ChatFilterPipe, DateFormatPipe, UppercasePipe,
  NotificationPortionPipe, NotEmptyPipe
} from "../filters/filters";
import {propertymain} from "../pages/propertymain/propertymain";
import {AddPropertyMain} from "../pages/AddPropertyMain/AddPropertyMain";
import {previousProperty} from "../pages/previousProperty/previousProperty";
import {LandlordToTenantInvitation} from "../pages/LandLordToTenantInvitation/LandlordToTenantInvitation";
import {verification_success} from "../pages/verification_success/verification_success";
import {properties} from "../pages/properties/properties";
import {Uploader} from 'angular2-http-file-upload';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from '@ionic-native/file'
import { AutoCompleteModule } from 'ionic2-auto-complete';
import {Geolocation} from '@ionic-native/geolocation'
import {TabindexDirective} from '../directive/directive'
import {dashboardPage} from "../pages/dashboard/dashboard";
import { CustomHeader } from '../pages/header-component';
import { ChartModule } from 'angular2-highcharts';
import {invitationsPage} from "../pages/invitations/invitations";
import { documents2Page } from '../pages/documents-2/documents-2';
import { documentsPage } from '../pages/documents/documents';
import { settingsPage } from '../pages/settings/settings';
import { paymentsBuildingPage } from '../pages/payments-building/payments-building';
import { paymentsFinalDetailsPage } from '../pages/payments-final-details/payments-final-details';
import { paymentsPage } from '../pages/payments/payments';
import {notificationsPage} from "../pages/notifications/notifications";
import {Keyboard} from "@ionic-native/keyboard";
import {splash1Page} from "../pages/splash/splash1";
import {websocketServer} from "../service/websocketService";
import {messages} from "../pages/messages/messages";
import {chat} from "../pages/chat/chat";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {  FCM } from '@ionic-native/fcm';
import {invoice1Page} from "../pages/invoice1/invoice1";
import {properties2} from "../pages/properties2/properties2";
import {profile} from "../pages/profile/profile";
import {invoicePage} from "../pages/invoice/invoice";
import {propertiesUnit} from "../pages/propertiesUnits/properties2";
declare var require: any;

@NgModule({
  declarations: [
    MyApp,
    entry,
    auth,
    login,
    signup,
    otp,
      CustomHeader,
    created,
    slider,
    resetinitiate,
    resetpassword,
    resetconfirmation,
    searchPipe,
    propertymain,
    AddPropertyMain,
    SafeUrlPipe,
    previousProperty,
    LandlordToTenantInvitation,
    verification_success,
    properties,
      TabindexDirective,
      dashboardPage,
      settingsPage,
      documentsPage,
      paymentsBuildingPage,
      paymentsFinalDetailsPage,
    NotificationPortionPipe,
      paymentsPage,
      documents2Page,
      invitationsPage,
      notificationsPage,
      CutPipe,
      splash1Page,
      messages,
    ChatFilterPipe,
      chat,
    DateFormatPipe,
    UppercasePipe,
      invoicePage,
      invoice1Page,
      profile,
    properties2,
    NotEmptyPipe,
    propertiesUnit
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      // These options are available in ionic-angular@2.0.0-beta.2 and up.
      scrollAssist: false,    // Valid options appear to be [true, false]
      autoFocusAssist: false, // Valid options appear to be ['instant', 'delay', false]
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    }


),

    HttpModule,
    AutoCompleteModule.forRoot(),
    IonicStorageModule.forRoot(),
    FormsModule,
    ChartModule.forRoot(require('highcharts'))

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    entry,
    auth,
    login,
    signup,
    otp,
    created,
    slider,
    resetinitiate,
      CustomHeader,
    resetpassword,
    resetconfirmation,
    propertymain,
    AddPropertyMain,
    previousProperty,
    LandlordToTenantInvitation,
    verification_success,
    properties,
    dashboardPage,
    settingsPage,
    documentsPage,
    paymentsBuildingPage,
      paymentsFinalDetailsPage,
    paymentsPage,
    paymentsPage,
    documents2Page,
      invitationsPage,
      notificationsPage,
    splash1Page,
      messages,
      chat,
    properties2,
      profile,
      invoicePage,
      invoice1Page,
    propertiesUnit

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Uploader,
      websocketServer,
      File,
      FileTransfer,
     FCM,
InAppBrowser,
      Geolocation,
      Keyboard,
      ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}

  ]
})
export class AppModule {}
