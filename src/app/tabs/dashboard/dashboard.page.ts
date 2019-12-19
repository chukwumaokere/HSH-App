import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ProfileModalPage } from 'src/app/services/profile/profile.page';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user_id: any = 1;
  userinfo: any;
  profile_picture: any;
  has_profile_picture: boolean = false;
  apiurl:any;
  dataReturned: any;

  //Chart Info
  @ViewChild('barChart', <any>[]) barChart: ElementRef;
  @ViewChild('actionsNeeded', <any>[]) actionsNeeded: ElementRef;
  bars: any;
  ring: any;
  colorArray: any;

  constructor(
    public storage: Storage,
    private router:  Router,
    private activatedRoute: ActivatedRoute,
    public modalCtrl : ModalController
  ) { }

  createBarCharts() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Assigned Jobs',
          data: [2.5, 3.8, 5, 6.9, 6.9],
          backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.ring = new Chart(this.actionsNeeded.nativeElement, {
      type: 'doughnut',
      data: {

      },
      options:{

      }
    });
  }


  fetchDashboard(){
    var record_id = this.user_id;
   /*  this.userinfo.first_name = this.userinfo.firstname;
    this.userinfo.last_name = this.userinfo.lastname;
    this.userinfo.email1 = "cokere@boruapps.com";
    this.userinfo.user_name = "Chuck";
    this.userinfo.profile_picture = this.userinfo.pic;
    this.has_profile_picture = true; */
    console.log("fetching dashboard data for", record_id);
    this.createBarCharts();
  }

  async openSettings(){
    console.log('opening settings page for user id', this.user_id);
     const modal = await this.modalCtrl.create({
         component: ProfileModalPage,
         componentProps: {
             "user_id" : this.user_id,
             "userinfo": this.userinfo,
         }
     });

     modal.onDidDismiss().then((dataReturned) => {
         if (dataReturned !== null) {
             this.dataReturned = dataReturned.data;
         }
     });

     return await modal.present();
  }
  goToPage(page){
    this.router.navigate(['tabs/' + page, {}]);
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
    this.fetchDashboard();
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
}
