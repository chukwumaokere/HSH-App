import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';
import  {NavController, ToastController } from '@ionic/angular';
import * as userjson from '../../assets/js/sampledata/users.json';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../providers/constant/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    apiurl: any;
    vturl: any;
  constructor(
      private  router: Router,
      public storage: Storage,
      public toastController: ToastController,
      private httpClient: HttpClient,
      public appConst: AppConstants,
      private navCtrl: NavController
  ) {
      this.apiurl = this.appConst.getApiUrl();
      this.vturl = this.appConst.getVtUrl();
  }

  userdata: Object;

  malformedUriErrorHandler(error: any){
    console.log(error);
  }
  
  async presentToast(message: string) {
    var toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: "top",
      color: "danger"
    });
    toast.present();
  }

  login(form: any, origin: any){
    //TODO: Wrap storage setting and data setting to API call return
     console.log('login function accessed');
      var headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');

      if(origin == 'manual'){
      console.log('login clicked');
            var formvalue = form.value;
                console.log(form.value);
                this.httpClient.post(this.apiurl + "postLogin.php", form.value, {headers: headers, observe: 'response'})
                    .subscribe(data => {
                        console.log(data['body']);
                        var verified = data['body']['success'];
                        console.log('login response was', verified);
                        if (verified == true) {
                            var data_ = data['body']['data'];
                            if (data_ == 'auth_created' || formvalue.method == 'check') {
                                this.presentToast('Please enter Auth Code.');
                                form.controls['method'].setValue('login');
                                form.controls['auth_code'].removeClass('ng-hide');
                            }
                            else if (data_ == 'missing_auth_code') {
                                this.presentToast('Please enter Auth Code.');
                            } else {
                                var contractors = data['body']['contractors'];
                                console.log('usersdata', contractors[0]);
                                this.storage.ready().then(() => {
                                    this.userdata = contractors[0];
                                    this.storage.set('userdata', this.userdata);
                                    //return this.router.navigate(["/tabs/dashboard", this.userdata]);
                                    this.navCtrl.navigateForward('/tabs/dashboard');
                                });
                            }
                        } else {
                            console.log('login failed');
                            this.presentToast('Login failed. Please try again');
                        }

                    }, error => {
                        //console.log(error);
                        //console.log(error.message);
                        //console.error(error.message);
                        console.log('login failed');
                        this.presentToast('Login failed. Please try again');
                    });

      /*if (userjson.users[data.email]){
        if(userjson.users[data.email].password == data.password){
          this.userdata = userjson.users[data.email];
          this.storage.ready().then(() => {
            this.storage.set('userdata', this.userdata);
            //return this.router.navigate(["/tabs/dashboard", this.userdata]);
            this.navCtrl.navigateForward('/tabs/dashboard');
          })
        }else{
          console.log('login failed');
          this.presentToast('Login failed. Please try again');
        }
      }else{
        console.log('login failed');
        this.presentToast('Login failed. Please try again');
      }*/
    /* Verify user login */
    }else if (origin == 'auto'){
      console.log('auto login from session');
      //return this.router.navigate(["/tabs/dashboard", form]);
      this.navCtrl.navigateForward('/tabs/dashboard');
    }

    return false;
  }

  async isLogged(){
   var log_status = this.storage.get('userdata').then((userdata) => {
      if(userdata && userdata.length !== 0){
        return userdata;
      }else{
        return false;
      }
    })
    return log_status;
  }

  movefocus(e, ref){
     if(e.key=="Enter"){
      console.log(e.key);
      ref.setFocus();
    } 
  }

  submit(e, ref){
    if(e.key=="Enter"){
     console.log('submitting');
     let el: HTMLElement = document.getElementById('submit-button') as HTMLElement;
     el.click()
    }
  }

  ngOnInit() {
    this.isLogged().then(result => {
      if (!(result == false)){
        console.log('loading storage data', result);
        this.login(result, "auto");
      }else{
        console.log('init login failed');
      }
    })
  }
}
