import {Component, OnInit, LOCALE_ID, Inject,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {formatDate} from '@angular/common';
import {Storage} from '@ionic/storage';
import {ProfileModalPage} from './profile/profile.page';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {AppConfig} from '../AppConfig';


@Component({
    selector: 'app-services',
    templateUrl: './services.page.html',
    styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
    userinfo: any;
    newJobs: object;
    activeJobs: object;
    user_id: any;
    apiurl: any;
    service = {
        id: '',
        title: '', //Will be the Transferee + type of service
        desc: '', //Will be address here
        longdate: '',
        longdate_2: '',
        startTime: '', //Will be time as 00:00 A/PM
        endTime: '', //Will be time as 00:00 A/PM
        status: '',
        coordinator: '',
        city: ''
    };

    randomPeople = ['Ojomo', 'Charisse', 'Mitsue', 'Lilia', 'Lynelle', 'Lavette', 'Kerry', 'Beckie', 'Nathan', 'Kristle', 'Nickie', 'Coretta', 'Randy', 'Carmon', 'Bev', 'Maude', 'Cleora', 'Tracy', 'Casimira', 'Lowell', 'Particia', 'Bennie', 'Angelena', 'Elden', 'Marcel', 'Elene', 'Young', 'Rheba', 'Paulene', 'Latia', 'Shantay', 'Lavon', 'Dane', 'Darla', 'Joselyn', 'Zelda', 'Kasha', 'Kaitlin', 'Pasty', 'Essie', 'Delfina', 'Arla', 'Amy', 'Xavier', 'Jin', 'Ashlee', 'Millicent', 'Jeanetta', 'Willy', 'Rolf',];
    typesOfServices = ['Discard and Donate', 'Quick Start', 'Move IN Clean', 'Quick Start Exec', 'Move OUT Clean'];
    statuses = ['New', 'Accepted', 'Scheduled', 'Follow-Up', 'Complete', 'Awaiting Reponse', 'Withdrawn Invitation'];
    randomCoords = ['Lesley Mullen', 'Miki Brennan', 'Faye Feinstein', 'Schari Coale'];
    randomCity = ['Palo Alto', 'San Bernadino', 'Los Angeles', 'San Francisco', 'Sacramento', 'Oakland', 'Riverside', 'Fresno'];
    sectionScroll: any;

    constructor(
        public navCtrl: NavController,
        private  router: Router,
        public storage: Storage,
        private httpClient: HttpClient,
        public AppConfig: AppConfig,
        private activatedRoute: ActivatedRoute,
        @Inject(LOCALE_ID) private locale: string
    ) {
        this.apiurl = this.AppConfig.apiurl;
    }

    async loadRandomServices(type) {
        var limit = 50;
        var init = 0;
        if (type == 'today') {
            var limit = 3;
        } else if (type == 'future') {
            var limit = 10;
            init = 5;
        } else if (type == 'completed') {
            init = 15;
        }
        var services = [];
        for (var i = init; i < limit; i += 1) {
            var date = new Date();
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            var desc;
            var startMinute = Math.floor(Math.random() * 24 * 60);
            var endMinute = Math.floor(Math.random() * 180) + startMinute;
            startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
            endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
            var randomTOS = i % this.typesOfServices.length;
            var randomStatus = i % this.statuses.length;
            let start = formatDate(startTime, 'shortTime', this.locale);
            let end = formatDate(endTime, 'shortTime', this.locale);
            let longdate_2 = formatDate(endTime, 'mediumDate', this.locale);
            let longdate = formatDate(startTime, 'medium', this.locale);
            let kayeFormat = formatDate(startTime, 'mediumDate', this.locale);
            var availableStatuses = this.statuses;
            var status = this.statuses[randomStatus];
            if (type == 'today') {
                var availableStatuses = ['Accepted', 'Confirmed'];
            }
            if (type == 'future') {
                var availableStatuses = ['Waiting for a Reply', 'Mtg Scheduled', 'Following Up'];
            }
            var status = availableStatuses[i % availableStatuses.length];
            if (type == 'completed') {
                //var status = 'Completed';
                var availableStatuses = ['Completed'];
                var status = availableStatuses[i % availableStatuses.length];
            }
            services.push({
                id: i,
                title: this.randomPeople[i] + ': ' + this.typesOfServices[randomTOS],
                desc: '',
                longdate: kayeFormat,
                longdate_2: longdate_2,
                startTime: start,
                endTime: end,
                status: status,
                coordinator: this.randomCoords[i % this.randomCoords.length],
                city: this.randomCity[i % this.randomCity.length],
            });
        }
        return services;
    }

    goToDetail(serviceid) {
        this.router.navigateByUrl(`/services/detail/${serviceid}`, {state: {}});
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

    getListJobs(contractor_id) {
        console.log('fetching records for', contractor_id);
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + "getListJobs.php", {crmid: contractor_id}, { headers: headers, observe: 'response' })
            .subscribe(data => {
                console.log(data['body']);
                var success = data['body']['success'];
                console.log('login response was', success);

                if(success == true){
                    var jobs = data['body']['data'];
                    console.log('jobs', jobs);
                    if(data['body']['count'] > 0){
                        this.newJobs = jobs['new_jobs'];
                        this.activeJobs = jobs['active_jobs'];
                    }
                }else{
                    console.log('failed to fetch records');
                }

            }, error => {
                //console.log(error);
                //console.log(error.message);
                //console.error(error.message);
                console.log('failed to fetch records');
            });

    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((userData) => {
            if (userData.length !== 0) {
                this.userinfo = userData;
                console.log('param user data:', userData);
                if (userData.fragment) {
                    console.log(userData.fragment)
                    try {
                        var element = document.getElementById(userData.fragment);
                        this.sectionScroll = element;
                    } catch (err) {
                        console.log(err);
                    }
                }
                try {
                    this.loadTheme(userData.theme.toLowerCase());
                    this.getListJobs(userData.contractorsid);
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
                            this.loadTheme(result.theme.toLowerCase());
                            this.getListJobs(this.userinfo.contractorsid);
                            try {
                                console.log('scrolling to', this.sectionScroll);
                                this.sectionScroll.scrollIntoView();
                            } catch (err) {
                                //console.log(err);
                            }
                        } else {
                            console.log('nothing in storage, going back to login');
                            this.logout();
                        }
                    });
                }
            }
        });
    }

}
