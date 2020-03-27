import {Component, OnInit, LOCALE_ID, Inject,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController, ToastController, AlertController, ModalController} from '@ionic/angular';
import {formatDate} from '@angular/common';
import {Storage} from '@ionic/storage';
import {ActionSheet, ActionSheetOptions} from '@ionic-native/action-sheet/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {CommentsModalPage} from './comments/comments.page';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AppConfig} from '../../AppConfig';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    userinfo: any;
    contractorinfo: any;
    serviceid: any;
    dataReturned: any;
    apiurl: any;
    isCompleteJob: number = 0;
    updatefields: any = {};
    status_picklist: any = ['Released', 'Following Up', 'Mtg Scheduled', 'Waiting for a Reply'];
    secondaryInfo: any = {
        open: false,
    };

    servicedetail: any = {};
    buttonLabels = ['Take Photo', 'Upload from Library'];

    actionOptions: ActionSheetOptions = {
        title: 'Which would you like to do?',
        buttonLabels: this.buttonLabels,
        addCancelButtonWithLabel: 'Cancel',
        androidTheme: 1 //this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
    }
    options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: false //true causes crash probably due to permissions to access library.
    }

    libraryOptions: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    constructor(public toastController: ToastController,
                public alertController: AlertController,
                public modalCtrl: ModalController,
                private actionSheet: ActionSheet,
                private callNumber: CallNumber,
                private camera: Camera,
                public navCtrl: NavController,
                private  router: Router,
                public storage: Storage,
                private activatedRoute: ActivatedRoute,
                private emailComposer: EmailComposer,
                private httpClient: HttpClient,
                public AppConfig: AppConfig,
                private iab: InAppBrowser,
                @Inject(LOCALE_ID) private locale: string) {
        this.secondaryInfo.open = false;
        this.apiurl = this.AppConfig.apiurl;
    }

    loadDetails(serviceid) {
        console.log('loading details for service id:', serviceid)
        var params = {
            record_id: serviceid
        }
        var headers = new HttpHeaders();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + 'getJobDetail.php', params, {headers: headers, observe: 'response'})
            .subscribe(data => {
                console.log(data['body']);
                var success = data['body']['success'];
                console.log('getJobDetail response was', success);
                if (success == true) {
                   // var workorder = data['body']['data'];
                    var allfields = data['body']['allfields'];
                    console.log('allfields are', allfields);
                    this.servicedetail = allfields;
                    if (allfields.job_status == 'Released') {
                        this.isCompleteJob = 1;
                    }
                    console.log('servicedetail', this.servicedetail);
                } else {
                    console.log('failed to fetch record');
                }

            }, error => {
                console.log('failed to fetch record');
            });
    }

    async  addUpdate(event) {
        console.log(this.updatefields);
        //console.log(event);
        var fieldname = event.target.name;
        var fieldvalue = event.target.textContent + event.target.value;
        if (event.target.tagName == 'ION-TEXTAREA' || event.target.tagName == 'ION-SELECT') {
            fieldvalue = event.target.value;
        }
        this.updatefields[fieldname] = fieldvalue;
        console.log('adding update to queue: ', fieldname, fieldvalue);
        console.log(this.updatefields);
    }

    async completeJob(salesorderid) {
        var field = {
            job_status: 'Released'
        };
        var params = {
            recordid: salesorderid,
            contractorsid: this.userinfo.contractorsid,
            updates: JSON.stringify(field)
        }
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + 'postSOInfo.php', params, { headers: headers, observe: 'response' })
            .subscribe(data=> {
                var success = data['body']['success'];
                console.log(data['body']);
                if(success == true){
                    console.log("Saved and updated data for jobs");
                }else{
                    this.presentToast('Failed to save due to an error');
                    console.log('failed to save record, response was false');
                }
                this.router.navigateByUrl('/services');
            }, error => {
                this.presentToast('Failed to save due to an error \n' + error.message);
                console.log('failed to save record', error.message);
            });
    }

    async  saveJob(salesorderid) {
        var data = this.updatefields;
        var data_stringified = JSON.stringify(data);
        console.log('attempting to submitting data to vtiger', salesorderid, data);
        var params = {
            recordid: salesorderid,
            contractorsid: this.userinfo.contractorsid,
            updates: data_stringified
        }
        if (Object.keys(data).length > 0) {
            console.log('Some data was changed, pushing ' + Object.keys(data).length + ' changes');
            var headers = new HttpHeaders();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            headers.append('Access-Control-Allow-Origin', '*');
            this.httpClient.post(this.apiurl + 'postSOInfo.php', params, { headers: headers, observe: 'response' })
                .subscribe(data=> {
                    var success = data['body']['success'];
                    console.log(data['body']);
                    if(success == true){
                        console.log("Saved and updated data for jobs");
                        this.navCtrl.navigateRoot('/tabs/services');
                        //this.router.navigateByUrl('/tabs/services');
                    }else{
                        this.presentToast('Failed to save due to an error');
                        console.log('failed to save record, response was false');
                    }
                }, error => {
                    this.presentToast('Failed to save due to an error \n' + error.message);
                    console.log('failed to save record', error.message);
                });
        } else {
            this.router.navigateByUrl('/tabs/services');
            console.log('no data modified for record', salesorderid);
        }

    }

    logout() {
        console.log('logout clicked');
        this.storage.set('userdata', null);
        this.router.navigateByUrl('/login');
    }

    async getCurrentTheme() {
        var current_theme = this.storage.get('userdata').then((userdata) => {
            if (userdata && userdata.length !== 0) {
                //current_theme = userdata.theme.toLowerCase();
                return userdata.theme.toLowerCase();
            } else {
                return false;
            }
        })
        return current_theme;
    }

    async updateCurrentTheme(theme: string) {
        var userjson: object;
        await this.isLogged().then(result => {
            if (!(result == false)) {
                userjson = result;
            }
        })
        //console.log('from set current theme', userjson.theme);
        userjson['theme'] = theme.charAt(0).toUpperCase() + theme.slice(1);
        //console.log('from set current theme', userjson);
        this.storage.set('userdata', userjson);
        this.userinfo.theme = theme.charAt(0).toUpperCase() + theme.slice(1);
        console.log('updated theme on storage memory');
    }

    async switchTheme() {
        var current_theme;
        await this.getCurrentTheme().then((theme) => {
            console.log('the current theme is', theme);
            current_theme = theme;
        });
        var theme_switcher = {
            'dark': 'light',
            'light': 'dark'
        };
        var destination_theme = theme_switcher[current_theme]
        console.log('switching theme from:', current_theme);
        console.log('switching theme to:', destination_theme);
        document.body.classList.toggle(destination_theme, true);
        document.body.classList.toggle(current_theme, false);
        this.updateCurrentTheme(destination_theme);
        console.log('theme switched');
    }

    async isLogged() {
        var log_status = this.storage.get('userdata').then((userdata) => {
            if (userdata && userdata.length !== 0) {
                return userdata;
            } else {
                return false;
            }
        })
        return log_status;
    }

    loadTheme(theme) {
        console.log('loading theme', theme);
        document.body.classList.toggle(theme, true);
        var theme_switcher = {
            'dark': 'light',
            'light': 'dark'
        };
        document.body.classList.toggle(theme_switcher[theme], false); //switch off previous theme if there was one and prefer the loaded theme.
        console.log('turning off previous theme', theme_switcher[theme]);
    }

   openCamera(serviceid) {
        console.log('launching camera');
        this.camera.getPicture(this.options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            let base64Image = 'data:image/png;base64,' + imageData;
            this.AppConfig.base64img = imageData;
            //this.imgpov.setImage(imageData);
            this.openModal(serviceid, base64Image);
            // TODO: need code to upload to server here.
            // On success: show toast
            this.presentToastPrimary('Photo uploaded and added! \n' + imageData);
        }, (err) => {
            // Handle error
            console.error(err);
            // On Fail: show toast
            if (err != 'no image selected') {
                this.presentToast(`Upload failed! Please try again \n` + err);
            }
        });
    }

    async openModal(serviceid,base64Image) {
        const modal = await this.modalCtrl.create({
            component: ImageModalPage,
            componentProps: {
                "base64Image": base64Image,
                "paramTitle": "Edit Photo",
                "serviceid" : serviceid,
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                this.dataReturned = dataReturned.data;
                //alert('Modal Sent Data :'+ dataReturned);
            }
        });

        return await modal.present();
    }

    async presentToast(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: 'top',
            color: 'danger'
        });
        toast.present();
    }

    async presentToastPrimary(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: 'bottom',
            color: 'primary'
        });
        toast.present();
    }

   openLibrary(serviceid) {
        console.log('launching gallery');
        this.camera.getPicture(this.libraryOptions).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            let base64Image = 'data:image/png;base64,' + imageData;
            this.AppConfig.base64img = imageData;
            this.openModal(serviceid,base64Image);
            // TODO: need code to upload to server here.
            // On success: show toast
            //this.presentToastPrimary('Photo uploaded and added! \n' + imageData);
        }, (err) => {
            // Handle error
            console.error(err);
            // On Fail: show toast
            if (err != 'has no access to assets') {
                this.presentToast(`Upload failed! Please try again \n` + err);
            }
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((userData) => {
            this.isLogged().then(result => {
                if (!(result == false)) {
                    console.log('loading storage data (within param route function)', result);
                    this.userinfo = result;
                    if (userData.serviceid) {
                        this.loadDetails(userData.serviceid);
                    }
                } else {
                    console.log('nothing in storage, going back to login');
                    this.logout();
                }
            });
        });
    }

    async goToComments(id) {
        console.log('Navigating to comments page for', id);
        const modal = await this.modalCtrl.create({
            component: CommentsModalPage,
            componentProps: {
                'id': id,
                'service_record_details': this.servicedetail,
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                this.dataReturned = dataReturned.data;
            }
        });

        return await modal.present();
    }

    call(phonenumber) {
        console.log('calling ', phonenumber);
        /* this.callNumber.callNumber(phonenumber, true)
        .then(res => console.log("Launched dialer!", res))
        .catch(err => console.log("Error launching", err)) */
        this.iab.create('tel:' + phonenumber, '_system');
    }

    sms(phonenumber) {
        console.log('smsing ', phonenumber);
        /* this.callNumber.callNumber(phonenumber, true)
        .then(res => console.log("Launched dialer!", res))
        .catch(err => console.log("Error launching", err)) */
        this.iab.create('sms:' + phonenumber, '_system');
    }

    chat(recordid) {
        console.log('opening chat for ', recordid);
        /* this.callNumber.callNumber(phonenumber, true)
        .then(res => console.log("Launched dialer!", res))
        .catch(err => console.log("Error launching", err)) */
        this.goToComments(recordid);
    }

    email(email) {
        console.log('emailing ', email);
        this.iab.create('mailto:' + email, '_system');
        /* let emailtemplate = {
          to: email,
          cc: 'chukwumaokere@yahoo.com',
          isHtml: true,
        }
        this.emailComposer.isAvailable().then((available: boolean) => {
          if(available){
            //send
          }
        }) */
    }

    contact(supportname) {
        console.log('opening action sheet for contact', supportname);
        var contactLabels = ['Call: ' + this.servicedetail.support_ph, 'Chat: ' + supportname, 'Email: ' + this.servicedetail.support_email];

        var contactOptions: ActionSheetOptions = {
            title: 'Which would you like to do?',
            buttonLabels: contactLabels,
            addCancelButtonWithLabel: 'Cancel',
            androidTheme: 1 //this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
        }
        this.actionSheet.show(contactOptions).then((buttonIndex: number) => {
            console.log('Option pressed', buttonIndex);
            if (buttonIndex == 1) {
                this.call(this.servicedetail.support_ph);
            }
            else if (buttonIndex == 2) {
                this.chat(this.serviceid);
            }
            else if (buttonIndex == 3) {
                this.email(this.servicedetail.support_email);
            }
        }).catch((err) => {
            console.log(err);
            this.presentToast(`Operation failed! \n` + err);
        })
    }

    toggleSecondary() {
        this.secondaryInfo.open = !this.secondaryInfo.open;
        console.log('secondary info is now', this.secondaryInfo.open);
    }
}
