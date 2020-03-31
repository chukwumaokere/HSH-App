import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import {Validators, FormBuilder, FormGroup } from '@angular/forms';
//import { ImageProvider } from '../../providers/image/image';
import {AppConfig} from '../../../AppConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsModalPage implements OnInit {
user_id: any = 1;
userinfo: any = {
  first_name: "Chuck",
  user_name: "admin",
  last_name: "Okere",
  email1: "cokere@boruapps.com",
  contractorsid: 2925705,
  //theme: "Dark",
};
imageData: any;
modalTitle:string;
modelId:number;
serviceid: any;
apiurl:any;
updatefields: any;
profile_picture: any;
has_profile_picture: boolean = false;
recordid: any;
servicedetail: any;
message: any;
show_button: any;
reqData: any;
request: any;
request_picklist: any = ['None', 'Hauler', 'Shredder', 'Helping Find Charity', 'More time', 'Damage occured', 'Other'];
// comments: any = [
//   {
//     user_id: 1,
//     author: "Chuck Okere",
//     message: "Hi, I was wondering when the start time for this service was?",
//     date_sent: "2019-12-12 01:22:30 PM",
//     read: true,
//   },
//   {
//     user_id: 14,
//     author: "Lesley Mullen",
//     message: "According to my records its for 1:30PM on December 14th; are you seeing something different?",
//     date_sent: "2019-12-12 01:30:22 PM",
//     read: true,
//   },
// ];
comments: any = [];
contractorsid: any;
contractorInfo: any = [];
dataReturned: any;
requestPicklistVal: any = '';

constructor(
    private modalController: ModalController,
    public storage: Storage,
    private  router: Router,
    private navParams: NavParams,
    public httpClient: HttpClient,
    private pickerCtrl: PickerController,
    //private formBuilder: FormBuilder,
    public toastController: ToastController,
    //public imgpov: ImageProvider,
    public AppConfig: AppConfig,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute
) {
    //this.imageData = this.imgpov.getImage();
    this.apiurl = this.AppConfig.apiurl;
}

ngOnInit() {
    this.userinfo.first_name = this.userinfo.firstname;
    this.userinfo.last_name = this.userinfo.lastname;
    this.userinfo.email1 = "cokere@boruapps.com";
    this.userinfo.user_name = "Chuck";
    this.userinfo.profile_picture = this.userinfo.pic;
    this.contractorsid = this.userinfo.contractorsid;
    this.has_profile_picture = true;
    this.recordid = this.navParams.data.id;
    this.servicedetail = this.navParams.data.service_record_details;
    this.show_button = this.navParams.data.show_button;
    this.contractorInfo = this.navParams.data.contractorInfo;
    /* this.user_id = this.navParams.data.user_id;
    this.userinfo = this.navParams.data.userinfo;
    this.profile_picture = this.navParams.data.userinfo.profile_picture;
    if(this.navParams.data.userinfo.imagename !== ""){
      this.has_profile_picture = true
    }else{
      this.has_profile_picture = false;
    }
    console.log('nav params', this.navParams.data.userinfo); */

    this.activatedRoute.params.subscribe((userData) => {
        if (userData.length !== 0) {
            this.userinfo = userData;
            console.log('param user data length:', userData.length);
            if (userData.length == undefined) {
                console.log('nothing in params, so loading from storage');
                this.isLogged().then(result => {
                    if (!(result == false)) {
                        console.log('loading storage data (within param route function)', result);
                        this.userinfo = result;
                        this.fetchComments();
                    } else {
                        console.log('nothing in storage, going back to login');
                        this.logout();
                    }
                });
            }
        }
    });
}

  loading: any;

  async showLoading() {
      this.loading = await this.loadingController.create({
          message: 'Loading ...'
      });
      return await this.loading.present();
  }

  async hideLoading() {
      setTimeout(() => {
          if (this.loading != undefined) {
              this.loading.dismiss();
          }
      }, 500);
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }
  
  fetchComments() {
    this.showLoading();
    const reqData = {
      crmid: this.recordid
    };
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    this.httpClient.post(this.apiurl + "getComment.php", reqData, {headers: headers, observe: 'response'})
      .subscribe(data => {
        console.log('Get Comments Success');
        const responseData = data.body;
        const success = responseData['success'];
        const commentCount = responseData['count'];
        if (success == true) {
          this.hideLoading();
          if(commentCount > 0){
            const getComments = responseData['data'];
            this.comments = getComments;
          }
        } else {
          this.hideLoading();
          console.log('failed to fetch Comments');
        }
      }, error => {
        this.hideLoading();
        console.log('failed to fetch Comments');
      });
  }
  updateMessage(e){
    //console.log(e);
    this.message = e.detail.value;
  }
  goToJob(serviceid){
    this.router.navigateByUrl(`/services/detail/${serviceid}`, {state: {}});
    this.closeModal();
  }
  
  async updateRequestPickList(event) {
      let fieldvalue = '';
      if (event.target.tagName == 'ION-SELECT') {
          fieldvalue = event.target.value;
          this.requestPicklistVal = fieldvalue;
      }
  }
  
  async sendMessage() {
    this.showLoading();
    const message = this.message;
    let commentContent = message;
    const req_picklist = this.requestPicklistVal;
    const contractorid = this.userinfo.contractorsid;
    const contractorname = this.userinfo.contractorname;
    if(typeof req_picklist != "undefined" && req_picklist != ''){
      commentContent = message + ' - Request: ' + req_picklist;
    }
    const updatefields = {
      crmid: this.recordid,
      userid: 1,
      commentcontent: commentContent,
      parent_comments: '',
      contractorid: contractorid,
      contractorname: contractorname,
      requestpicklist: req_picklist
    };
    const headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    this.httpClient.post(this.apiurl + "postComment.php", updatefields, {
        headers: headers,
        observe: 'response'
    })
        .subscribe(data => {
            const responseData = data.body;
            const success = responseData['success'];
            if (success == true) {
              this.closeModal();
              this.reloadComments(this.recordid);
              this.hideLoading();
            } else {
                this.hideLoading();
                console.log('failed to Push Comments');
            }
        }, error => {
            this.hideLoading();
            this.presentToast('failed to Push Comments \n' + error.message);
        });
  }
  
  async reloadComments(id) {
    const modal = await this.modalController.create({
      component: CommentsModalPage,
      componentProps: {
        "id": id,
        "service_record_details": this.servicedetail,
        'contractorInfo': this.userinfo
      }
    });
    
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
    });
    
    return await modal.present();
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

    logout(){
        console.log('logout clicked');
        this.storage.set("userdata", null);
        this.closeModal();
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
