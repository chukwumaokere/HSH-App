import { Component } from '@angular/core';
import {AppConfig} from '../AppConfig';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {LoadingController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  notifications: any = 0;
  apiurl: any = '';
    userinfo: any;
  constructor(
      private router: Router,
      public storage: Storage,
      private activatedRoute: ActivatedRoute,
      public appConfig: AppConfig,
      public loadingController: LoadingController,
      private httpClient: HttpClient,
  ) {
      this.apiurl = this.appConfig.apiurl;
  }

    ngOnInit() {
        this.activatedRoute.params.subscribe((userData) => {
            if (userData.length !== 0) {
                this.userinfo = userData;
                console.log('param user data:', userData);
                try {
                    //this.loadTheme(userData.theme.toLowerCase());
                } catch {
                    console.log('couldnt load theme');
                }
                console.log('param user data length:', userData.length);
                if (userData.length == undefined) {
                    console.log('nothing in params, so loading from storage');
                    this.isLogged().then(result => {
                        if (!(result == false)) {
                            console.log('loading storage data (within param route function)', result);
                            this.userinfo = result;
                            this.loadData(this.userinfo.contractorsid);
                            setInterval(() => {
                                console.log('refreshing under review count');
                                this.loadData(this.userinfo.contractorsid);
                            }, 5000);
                        } else {
                            console.log('nothing in storage, going back to login');
                            this.logout();
                        }
                    });
                }
            }
        });
    }

    loadData(contractorid) {
        const reqData = {
            contractorid
        };
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + 'getCountNotification.php', reqData, {headers, observe: 'response'})
            .subscribe(data => {
                const responseData = data.body;
                const success = responseData['success'];
                if (success == true) {
                    this.notifications = responseData['count'];
                } else {
                    console.log('failed to fetch Invites');
                }
            }, error => {
                console.log('failed to fetch Invites');
            });
    }

    async isLogged() {
        var log_status = this.storage.get('userdata').then((userdata) => {
            if (userdata && userdata.length !== 0) {
                return userdata;
            } else {
                return false;
            }
        });
        return log_status;
    }
    logout() {
        console.log('logout clicked');
        this.storage.set('userdata', null);
        this.router.navigateByUrl('/login');
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

}
