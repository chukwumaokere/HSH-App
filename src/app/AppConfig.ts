import { Injectable } from '@angular/core';

@Injectable()

export class AppConfig  {
    apiurl : string = 'https://hsh.borugroup.com/api/';
    vturl : string = 'https://hsh.borugroup.com/';
    base64img: string = '';
    fcmtoken: string = '';
    
    setFCMToken($value) {
        this.fcmtoken = $value;
    }
    getFCMToken() {
        return this.fcmtoken;
    }
}
