import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, NavParams } from '@ionic/angular';
import { UtilService } from '../util.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth,
  public navCtrl: NavController,
  public navParams: NavParams,
  private utilCtrl: UtilService) { }

  ngOnInit() {
  }

  async login(user: User) {
    this.afAuth.signInWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.navCtrl.navigateForward('home');
      })
      .catch((e) => {
        const errorCode: string = e.code;
        const errorMessage: string = e.message;
        if(errorCode.includes("missing-email")){
          this.utilCtrl.showToast("Insira seu e-mail e senha");
        }else if(errorCode.includes("wrong-password")){
          this.utilCtrl.showToast("Senha ou e-mail incorretos");
        }else if(errorCode.includes("internal-error")){
          this.utilCtrl.showToast("Insira sua senha");
        }else if(errorCode.includes("missing-email")){
          this.utilCtrl.showToast("Insira um e-mail");
        }
      });
  }

  register() {
    this.navCtrl.navigateForward('register');
  }

}
