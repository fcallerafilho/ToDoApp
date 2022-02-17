import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { NavController, NavParams } from '@ionic/angular';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user = {} as User;

  constructor( private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    private utilCtrl: UtilService) { }

  ngOnInit() {
  }

  async register(user: User) {
    this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.navCtrl.navigateForward('home');
      })
      .catch((error) => {
        const errorCode:string = error.code;
        const errorMessage:string = error.message;
        console.log(errorCode);
        if(errorCode.includes("admin-restricted-operation")){
          this.utilCtrl.showToast("Insira um e-mail e uma senha");
        }else if(errorCode.includes("internal-error")){
          this.utilCtrl.showToast("Insira uma senha");
        }else if(errorCode.includes("weak-password")){
          this.utilCtrl.showToast("Insira uma senha com no mínimo 6 caracteres");
        }else if(errorCode.includes("missing-email")){
          this.utilCtrl.showToast("Insira um e-mail");
        }else if(errorCode.includes("email-already-in-use")){
          this.utilCtrl.showToast("Esse e-mail já está sendo utilizado");
        }
      });
  }

  backbutton(){
    this.navCtrl.navigateBack('login');
  }

}
