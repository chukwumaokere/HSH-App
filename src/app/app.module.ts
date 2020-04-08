import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IonicStorageModule} from '@ionic/storage';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ActionSheet, ActionSheetOptions} from '@ionic-native/action-sheet/ngx';
import {PhotoLibrary} from '@ionic-native/photo-library/ngx';
//import {CallNumber} from '@ionic-native/call-number/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {CommentsModalPageModule} from './services/detail/comments/comments.module';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {AppConfig} from './AppConfig';
import {HttpClientModule} from '@angular/common/http';

import { ImageModalPage } from './services/image-modal/image-modal.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, IonicStorageModule.forRoot()],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        Camera,
        ActionSheet,
        PhotoLibrary,
        //CallNumber,
        EmailComposer,
        InAppBrowser,
        CommentsModalPageModule,
        ImageModalPage,
        AppConfig,
        FCM
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
