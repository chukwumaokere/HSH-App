import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
    apiurl : string = 'http://devl06.borugroup.com/hsh/api/';
    vturl : string = 'http://devl06.borugroup.com/hsh/';
    getApiUrl() {
        return this.apiurl;
    }
    getVtUrl() {
        return this.vturl;
    }
}
