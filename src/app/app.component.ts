import {Component} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FCM} from '@ionic-native/fcm/ngx';
import {AppConfig} from './AppConfig';
import {Router} from '@angular/router';
import { Firebase } from '@ionic-native/firebase/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private fcm: FCM,
        public appConst: AppConfig,
        private router: Router,
        public navCtrl: NavController,
        private firebase: Firebase,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // get FCM token
            this.getToken();

            // ionic push notification example
            this.fcm.onNotification().subscribe(data => {
                console.log(data);
                if (data.wasTapped) {
                    console.log('Received in background');
                    //this.router.navigate(['/tabs/notifications', {fragment: ''}]);
                    this.navCtrl.navigateRoot('tabs/notifications');
                } else {
                    console.log('Received in foreground');
                    //this.router.navigate(['/tabs/notifications', {fragment: ''}]);
                    this.navCtrl.navigateRoot('tabs/notifications');
                }
            });

            // refresh the FCM token
            this.fcm.onTokenRefresh().subscribe(token => {
                console.log(token);
                this.appConst.setFCMToken(token);
            });

            // unsubscribe from a topic
            // this.fcm.unsubscribeFromTopic('offers');
        });
    }

    async getToken() {
        let token;
        if (this.platform.is('android')) {
            token = await this.fcm.getToken();
        }
        if (this.platform.is('ios')) {
            token = await this.firebase.getToken();
            await this.firebase.grantPermission();
        }
        console.log(token);
        this.appConst.setFCMToken(token);
    }
}
