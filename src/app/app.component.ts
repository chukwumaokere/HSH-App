import {Component} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FCM} from '@ionic-native/fcm/ngx';
import {AppConfig} from './AppConfig';
import {Router} from '@angular/router';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

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
        private firebase: FirebaseX,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // get FCM token
            this.getToken();
            
            console.log('The app running in the background - TOP');

            // ionic push notification example
            /*
            this.fcm.onNotification().subscribe(data => {
                console.log(data);
                if (data.wasTapped) {
                    console.log('Received in background');
                    //this.router.navigate(['/tabs/notifications', {fragment: ''}]);
                    this.navCtrl.navigateRoot('tabs/notifications');
                } else {
                    console.log('Received in foreground');
                    //this.router.navigate(['/tabs/notifications', {fragment: ''}]);
                    //this.navCtrl.navigateRoot('tabs/notifications');
                }
            });

            // refresh the FCM token
            this.fcm.onTokenRefresh().subscribe(token => {
                console.log(token);
                this.appConst.setFCMToken(token);
            });
            */
            // unsubscribe from a topic
            // this.fcm.unsubscribeFromTopic('offers');
            this.firebase.onMessageReceived().subscribe(data => { 
                console.log('Push notification received: ', data);
                console.log('------------PUSH DATA-------------');
                console.log(JSON.stringify(data));
                console.log('------------PUSH DATA END-------------');
                if(data.tap){
                    console.log('Tab from Notification');
                    this.navCtrl.navigateRoot('tabs/notifications');
                }
            })
            
            console.log('The app running in the background - BOTTOM');
            
        });
    }
    async getToken() {
        let token;
        if (this.platform.is('android')) {
            //token = await this.fcm.getToken();
            this.firebase.getToken().then(token => { 
                console.log(`The token is ${token}`)
                this.appConst.setFCMToken(token);
            });
            //this.appConst.setFCMToken(token);
        }
        if (this.platform.is('ios')) {
            await this.firebase.grantPermission();
            //token = await this.firebase.getToken();
            this.firebase.getToken().then(token => { 
                console.log(`The token is ${token}`)
                this.appConst.setFCMToken(token);
            });
        }
        console.log('token is: ', token);
        //this.appConst.setFCMToken(token);
    }
}
