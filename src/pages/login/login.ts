import { Component, NgZone} from '@angular/core';
import { Platform } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { TabsPage } from '../tabs/tabs';
//import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GooglePlus]
})
export class LoginPage {
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private platform:Platform, 
    private googlePlus: GooglePlus,
    public zone: NgZone
  ) {
    this.platform.ready().then(() => {
      this.zone.run(() => {
        this.checkLogin();
      });
    });
  }

  login() {
    console.log('antes de login')
    this.googlePlus.login({})
    .then(res => {
      this.loginProccess(res);
    })
    .catch(err => console.error(err));
  }

  loginProccess(res) {
    localStorage.setItem('user', res);
    this.navCtrl.push(TabsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async checkLogin() {
    try {
      let res = await this.googlePlus.trySilentLogin({});
      this.loginProccess(res);
    } catch (error) {
      console.log("User Not Found");
    }
  }

}
