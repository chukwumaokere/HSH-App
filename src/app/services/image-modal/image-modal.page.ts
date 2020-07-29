import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, PickerController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {AppConfig} from '../../AppConfig';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
imageData: any;
modalTitle:string;
modelId:number;
serviceid: any;
apiurl:any;
photo = {
    title: '',
    primary_title:'',
    secondary_title:'',
    tower_section: '',
    serviceid: '',
    base64Image: ''
    };

constructor(
private modalController: ModalController,
private navParams: NavParams,
public httpClient: HttpClient,
private pickerCtrl: PickerController,
//private transfer: FileTransfer,
private formBuilder: FormBuilder,
public toastController: ToastController,
public AppConfig: AppConfig,
public loadingController: LoadingController,
){
    this.imageData = this.AppConfig.base64img;
    this.apiurl = this.AppConfig.apiurl;
}

  ngOnInit() {
  //console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.serviceid = this.navParams.data.serviceid;
    this.modalTitle = this.navParams.data.paramTitle;
  }
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  async showPicker(){
      var x;
      var optionValues = [];
      for(x=0; x < 101; x++){
        optionValues.push({text: x, value: x})
      }
      let opts = {
        cssClass: 'section-picker',
        buttons: [
         {text: 'Cancel', role: 'cancel', cssClass: 'section-picker-cancel'},
         {text: 'Confirm', cssClass: 'section-picker-confirm'},
        ],
        columns: [{
            name: 'section',
            options: optionValues
        }],
      }

      let picker = await this.pickerCtrl.create(opts);
      picker.present();
      picker.onDidDismiss().then( async data => {
          let col = await picker.getColumn('section');
          if(col.options[col.selectedIndex].text){
            this.photo.tower_section = col.options[col.selectedIndex].text;
            if (this.photo.primary_title !== '' || this.photo.secondary_title !== ''){
                this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section ;
            }else{
                this.photo.title = this.photo.tower_section ;
            }
            //this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + col.options[col.selectedIndex].text;
          }
      })
  }

  async  uploadImage(form){
      this.showLoading('Uploading ...');
      var headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      form.value.base64Image = this.imageData;
      form.value.serviceid = this.serviceid;
      const reqData = {
        base64Image: this.imageData,
        serviceid: this.serviceid,
      }
      console.log('Request Data: ', reqData);
      this.httpClient.post(this.apiurl + "postPhotos.php", reqData, { headers:headers, observe: 'response' })
          .subscribe(data => {
              this.hideLoading(1000);
              console.log('base64Image: ' + this.imageData);
              if(data['body']['success'] == true){
                this.presentToastPrimary('Photo uploaded and added to Work Order', 3000);
                this.closeModal();
              }else{
                  console.log('upload failed');
                  this.presentToast('Upload failed! Please try again \n');
              }
          }, error => {
              //console.log(error);
              //console.log(error.message);
              //console.error(error.message);
              this.hideLoading(1000);
              this.presentToast("Upload failed! Please try again \n" + error.message);
          });
  }
  
    async  fillTowerSection(section){
        this.photo.tower_section = section;
        if (this.photo.primary_title !== '' || this.photo.secondary_title !== ''){
            this.photo.title = this.photo.primary_title + "-" + this.photo.secondary_title + "-" + this.photo.tower_section ;
        }else{
            this.photo.title =  this.photo.tower_section ;
        }
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

    async presentToastPrimary(message: string, duration: number = 2000) {
        var toast = await this.toastController.create({
            message: message,
            duration: duration,
            position: "bottom",
            color: "primary"
        });
        toast.present();
    }
    
    loading: any;

    async showLoading( message: string = 'Loading ...' ) {
        this.loading = await this.loadingController.create({
            message
        });
        return await this.loading.present();
    }

    async hideLoading(time: any = 3000) {
        setTimeout(() => {
            if (this.loading != undefined) {
                this.loading.dismiss();
            }
        }, time);
    }
}
