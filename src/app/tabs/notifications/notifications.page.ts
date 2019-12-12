import { Component, OnInit, LOCALE_ID, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from  "@angular/router";
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  userinfo: any;
  invites: any = [
    {
      id: 0,
      service_title: "Ojo: Discard and Donate",
      service_date: "December 21, 2019",
      service_starttime: "12:00PM",
      service_endtime: "1:30PM",
    },
    {
      id: 1,
      service_title: "Lavette: Quick Start",
      service_date: "December 24, 2019",
      service_starttime: "1:00PM",
      service_endtime: "1:30PM",
    },
    {
      id: 2,
      service_title: "Beckie: Move IN Clean",
      service_date: "December 28, 2019",
      service_starttime: "3:00PM",
      service_endtime: "4:30PM",
    }
  ];
  notifications: any = [
    {
      title: "You've been assigned a new service record",
      date: "December 12, 2019 11:00:00 PM",
      comment: "Test"
    },
    {
      title: "You've received a rating for a service record",
      date: "December 11, 2019 09:54:32 PM",
      comment: "Test 2"
    },
    {
      title: "You've received a rating for a service record",
      date: "December 10, 2019 06:30:14 PM",
      comment: "Test 3"
    }
  ];
  count_invites: any = 3;
  count_notifications: any = 3;
  constructor(public navCtrl: NavController, private  router:  Router, public storage: Storage, private activatedRoute: ActivatedRoute, private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string ) { }
  logout(){
    console.log('logout clicked');
    this.storage.set("userdata", null);
    this.router.navigateByUrl('/login');
  }

  async getCurrentTheme(){
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
  loadTheme(theme){
    console.log('loading theme', theme);
    document.body.classList.toggle(theme, true);
    var theme_switcher = {
      "dark": "light", 
      "light": "dark"
    };
    document.body.classList.toggle(theme_switcher[theme], false); //switch off previous theme if there was one and prefer the loaded theme.
    console.log('turning off previous theme', theme_switcher[theme]);
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe((userData)=>{
      if(userData.length !== 0){
        this.userinfo = userData;
        console.log('param user data:', userData);
        try{ 
          this.loadTheme(userData.theme.toLowerCase());
        }catch{
          console.log('couldnt load theme');
        }
        console.log('param user data length:', userData.length);
        if(userData.length == undefined){
          console.log ('nothing in params, so loading from storage');
          this.isLogged().then(result => {
            if (!(result == false)){
              console.log('loading storage data (within param route function)', result);
              this.userinfo = result;
              this.loadTheme(result.theme.toLowerCase());
            }else{
              console.log('nothing in storage, going back to login');
              this.logout();
            }
          }); 
        }
      }
    }); 
  }

  modifyInvite(choice, id){
    console.log('action taken', choice, id);
  }

}
