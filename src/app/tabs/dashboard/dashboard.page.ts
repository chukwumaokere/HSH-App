import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Storage} from '@ionic/storage';
import {ProfileModalPage} from 'src/app/services/profile/profile.page';
import {ModalController} from '@ionic/angular';
import {Chart} from 'chart.js';
import {AppConfig} from '../../AppConfig';
import {LoadingController} from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
    apiurl: any;
    vturl: any;
    dataReturned: any;
    dashboardData: {
        new_invites: {
            total: 0,
            data: {}
        },
        new_jobs: {
            total: 0,
            data: {}
        },
        active_jobs: {
            total: 0,
            data: {}
        },
        update_needed: {
            total: 0,
            data: {}
        },
        request: {
            total: 0,
            data: {}
        },
        response: {
            total: 0,
            data: {}
        },
    };

    //Chart Info
    @ViewChild('barChart', <any> []) barChart: ElementRef;
    @ViewChild('actionsNeeded', <any> []) actionsNeeded: ElementRef;
    @ViewChild('line', <any> []) line: ElementRef;
    bars: any;
    ring: any;
    lines: any;

    constructor(
        public storage: Storage,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public modalCtrl: ModalController,
        public AppConfig: AppConfig,
        public loadingController: LoadingController,
        private httpClient: HttpClient,
    ) {
        this.apiurl = this.AppConfig.apiurl;
        this.vturl = this.AppConfig.vturl;
    }

    createCharts() {
        this.bars = new Chart(this.barChart.nativeElement, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [
                    {
                        label: 'Assigned Jobs',
                        data: [2.5, 3.8, 5, 1, 6.9],
                        backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                        borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
                        borderWidth: 1
                    },
                    {
                        label: 'Questions per Job',
                        data: [5, 2, 1, 7, 3],
                        backgroundColor: 'rgb(38, 194, 255)', // array should have same number of elements as number of dataset
                        borderColor: 'rgb(38, 194, 255)',// array should have same number of elements as number of dataset
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: false,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };
        this.ring = new Chart(this.actionsNeeded.nativeElement, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                    ],
                    backgroundColor: [
                        'rgba(255,0,0,1)',
                        'rgba(0,255,0,1)',
                        'rgba(0,0,255,1)',
                    ],
                    label: 'Dataset 1',
                    //borderWidth: '50px'
                    weight: 5,
                }],
                labels: [
                    /* 'New Invites',
                    'Initial Contact Needed',
                    'Job Reports Needed' */
                    'Invites',
                    'Contact Needed',
                    'Reports Needed'
                ]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                legend: {
                    position: 'top',
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
                title: {
                    display: false,
                }
            }
        });
        this.lines = new Chart(this.line.nativeElement, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
                datasets: [
                    {
                        label: 'Jobs per Week',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
                        spanGaps: false,
                    },
                    {
                        label: 'Invites per Week',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(255,255,0,0.4)',
                        borderColor: 'rgba(255,255,0,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(255,255,0,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(255,255,0,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [20, 30, 42, 10, 70, 15, 65, 55, 5, 40, 30, 15],
                        spanGaps: false,
                    }
                ]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
                title: {
                    display: false,
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
        }, 250);
    }

    fetchDashboard() {
        var record_id = this.user_id;
        /*  this.userinfo.first_name = this.userinfo.firstname;
         this.userinfo.last_name = this.userinfo.lastname;
         this.userinfo.email1 = "cokere@boruapps.com";
         this.userinfo.user_name = "Chuck";
         this.userinfo.profile_picture = this.userinfo.pic;
         this.has_profile_picture = true; */
        console.log('fetching dashboard data for', record_id);
        this.createCharts();
    }

    async openSettings() {
        console.log('opening settings page for user id', this.user_id);
        const modal = await this.modalCtrl.create({
            component: ProfileModalPage,
            componentProps: {
                'user_id': this.user_id,
                'userinfo': this.userinfo,
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned !== null) {
                this.dataReturned = dataReturned.data;
            }
        });

        return await modal.present();
    }

    goToPage(page, dst = '') {
        this.router.navigate(['tabs/' + page], {fragment: dst}); 
        //this.router.navigateByUrl('tabs/' + page, {fragment: dst}); //also doesnt work
        //this.router.navigateByUrl('tabs/' + page);
    }

    ngOnInit() {

        this.dashboardData = {
            new_invites: {
                total: 0,
                data: {}
            },
            new_jobs: {
                total: 0,
                data: {}
            },
            active_jobs: {
                total: 0,
                data: {}
            },
            update_needed: {
                total: 0,
                data: {}
            },
            request: {
                total: 0,
                data: {}
            },
            response: {
                total: 0,
                data: {}
            },
        };
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
                            /*const contractorname = result.contractorname;
                            const names = contractorname.split(' ');
                            this.userinfo.firstname = names[0];*/
                            this.loadTheme(result.theme.toLowerCase());
                            this.loadDashboardData(this.userinfo.id, this.userinfo.contractorsid);
                        } else {
                            console.log('nothing in storage, going back to login');
                            this.logout();
                        }
                    });
                }
            }
        });
        //this.fetchDashboard();
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
        });
        return current_theme;
    }

    async updateCurrentTheme(theme: string) {
        var userjson: object;
        await this.isLogged().then(result => {
            if (!(result == false)) {
                userjson = result;
            }
        });
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
        var destination_theme = theme_switcher[current_theme];
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
        });
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

    loadDashboardData(user_id, contractor_id){
        const data = {
            user_id: user_id,
            contractor_id: contractor_id
        };
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.showLoading();
        this.httpClient.post(this.apiurl + 'getJobs.php', data, {headers, observe: 'response'})
            .subscribe(data => {
                this.hideLoading();
                const responseData = data.body;
                const success = responseData['success'];
                console.log(data);
                if (success == true) {
                    const items = responseData['data'];
                    items.forEach(item => {
                        console.log(item);
                        if(item.title == 'New Invites'){
                            this.dashboardData.new_invites.total = item.count;
                        } else if (item.title == 'New Jobs'){
                            this.dashboardData.new_jobs.total = item.count;
                        } else if (item.title == 'Active Jobs'){
                            this.dashboardData.active_jobs.total = item.count;
                        } else if (item.title == 'Requests') {
                            this.dashboardData.request.total = item.count;
                        } else if (item.title == 'Responses') {
                            this.dashboardData.response.total = item.count;
                        } else if (item.title == 'UpdateNeeded') {
                            this.dashboardData.update_needed.total = item.count;
                        }
                    });
                } else {
                    console.log('failed to fetch records');
                }

            }, error => {
                this.hideLoading();
                console.log('failed to fetch records');
            });
    }
}
