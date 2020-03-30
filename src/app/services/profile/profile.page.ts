import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {AppConfig} from '../../AppConfig';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfileModalPage implements OnInit {
user_id: any;
userinfo: any = {};
apiurl: any;
updatefields: any = {};
has_profile_picture: boolean = false;

constructor(
private modalController: ModalController,
public storage: Storage,
private  router: Router,
private navParams: NavParams,
private pickerCtrl: PickerController,
public toastController: ToastController,
private httpClient: HttpClient,
public appConst: AppConfig,
) {
   this.apiurl = this.appConst.apiurl;
}

  ngOnInit() {
      this.isLogged().then(result => {
          if (!(result == false)) {
              console.log('loading storage data (within param route function)', result);
              this.userinfo = result;
              this.loadTheme(result.theme.toLowerCase());
          } else {
              console.log('nothing in storage, going back to login');
              this.logout();
          }
      });
      this.has_profile_picture = false;
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  async  addUpdate(event) {
    //console.log(event);
      var fieldvalue = event.target.textContent;
      var fieldname = event.target.name;
      this.updatefields[fieldname] = fieldvalue;
      console.log(this.updatefields);
      var params = {
          contractorsid: this.userinfo.contractorsid,
          updates: JSON.stringify(this.updatefields)
      }
      var headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      this.httpClient.post(this.apiurl + "updateProfile.php", params, { headers:headers, observe: 'response' })
          .subscribe(data => {
              if ( data['body']['success'] == true) {
                this.presentToastPrimary('Profile updated \n');
                  this.storage.ready().then(() => {
                      this.userinfo = data['body']['data'];
                      this.userinfo.theme = this.getCurrentTheme();
                      this.storage.set('userdata', this.userinfo);
                  });
                this.closeModal();
              } else {
                  console.log('update failed');
                  this.presentToast('Profile update failed! Please try again \n');
              }
          }, error => {
              this.presentToast("Profile update failed! Please try again \n" + error.message);
          });
  }

    async presentToast(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 3500,
            position: "bottom",
            color: "danger"
        });
        toast.present();
    }

    async presentToastPrimary(message: string) {
        var toast = await this.toastController.create({
            message: message,
            duration: 2000,
            position: "bottom",
            color: "primary"
        });
        toast.present();
    }

    logout() {
        console.log('logout clicked');
        this.storage.set("userdata", null);
        this.closeModal();
        this.router.navigateByUrl('/login');
    }
    async getCurrentTheme() {
        var current_theme = this.storage.get('userdata').then((userdata) => {
          if(userdata && userdata.length !== 0){
            //current_theme = userdata.theme.toLowerCase();
            return userdata.theme.toLowerCase();
          }else{
            return false;
          }
        })
       return current_theme;
    }
    async updateCurrentTheme(theme: string){
        var userjson: object;
        await this.isLogged().then(result => {
          if (!(result == false)){
            userjson = result;
          }
        })
        //console.log('from set current theme', userjson.theme);
        userjson['theme'] = theme.charAt(0).toUpperCase() + theme.slice(1);
        //console.log('from set current theme', userjson);
        this.storage.set('userdata', userjson);
        this.userinfo.theme= theme.charAt(0).toUpperCase() + theme.slice(1);
        console.log('updated theme on storage memory');
      }
      async switchTheme(){
        var current_theme;
        await this.getCurrentTheme().then((theme) => {
          console.log("the current theme is", theme);
          current_theme = theme;
        });
        var theme_switcher = {
                              "dark": "light", 
                              "light": "dark"
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
            if(userdata && userdata.length !== 0){
                return userdata;
            }else{
                return false;
            }
        })
        return log_status;
    }
    loadTheme(theme) {
        console.log('loading theme', theme);
        document.body.classList.toggle(theme, true);
        var theme_switcher = {
            "dark": "light",
            "light": "dark"
        };
        document.body.classList.toggle(theme_switcher[theme], false); //switch off previous theme if there was one and prefer the loaded theme.
        console.log('turning off previous theme', theme_switcher[theme]);
    }

}
