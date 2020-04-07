import { Injectable } from '@angular/core';

@Injectable()

export class AppConfig  {
    apiurl : string = 'https://devl06.borugroup.com/hsh/api/';
    vturl : string = 'https://devl06.borugroup.com/hsh/';
    base64img: string = '';
    fcmtoken: string = '';
    
    setFCMToken($value) {
        this.fcmtoken = $value;
    }
    getFCMToken() {
        return this.fcmtoken;
    }
}
