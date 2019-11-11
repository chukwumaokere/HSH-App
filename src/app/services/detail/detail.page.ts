import { Component, OnInit, LOCALE_ID, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from  "@angular/router";
import { NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  userinfo: any;
  serviceid: any;
  servicedetails: object;
  servicedetail = {
    transferee_lastname: '',
    transferee_firstname: '',
    transferee_phonenumber: '',
    secondary_lastname: '',
    secondary_firstname: '',
    secondary_phonenumber: '',
    address_details: '',
    d_for_dd: '',
    status: '',
    support: '',
    service_type: '',
    title: '',
    complete_date: '',
    desc: '',
    startdate: '',
    starttime:'',
    duedate: '',
    duetime: '',
    enddate: '',
    endtime: ''
  }
  constructor(public navCtrl: NavController, private  router:  Router, public storage: Storage, private activatedRoute: ActivatedRoute, @Inject(LOCALE_ID) private locale: string) { }

  loadDetails(serviceid){
    console.log('loading details for service id:', serviceid)
    var result = {
      transferee_firstname: 'Feyi',
      transferee_lastname: 'Ojomo',
      transferee_phonenumber: '7073650079',
      secondary_firstname: 'Esosa',
      secondary_lastname: 'Ojomo',
      secondary_phonenumber: '2133088643',
      address_details: '872 Kells Circle, Vacaville, CA 95688',
      d_for_dd: 'Hillsboro, OR',
      status: '1 In-Process',
      service_type: 'Discard and Donate',
      support: 'Jackie Quick',
      title: 'Ojomo: Discard and Donate',
      complete_date: '',
      desc: `***********************************************
      Please ensure that the Consultant is copied on all correspondence moving forward  
      House, 4 room, 2200 Sq ft
      Entered by SL on 10/31/19 DD`,
      startdate: '2019-11-12',
      starttime: '08:00AM',
      duedate: '2019-11-12',
      duetime: '09:00AM',
      enddate: '',
      endtime:'',
    };
    this.servicedetail = result;
  }

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
        if(userData.serviceid){
          this.loadDetails(userData.serviceid);
        }
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

}
