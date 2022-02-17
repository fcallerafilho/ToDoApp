import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, ToastController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks : any[] = [];
  taskPesquisa : any[] = [];
  nomePesquisa : string;
  
  constructor(private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl : AlertController,
    private actionSheet : ActionSheetController) {

      let taskJson = localStorage.getItem("taskDB");
    this.taskPesquisa = this.tasks;

    if (taskJson!=null){
      this.tasks = JSON.parse(taskJson);
    }

    }

    ionViewDidLoad() {
      this.afAuth.authState.subscribe(async data => {
        if (data && data.email && data.uid) {
          (await this.toastCtrl.create({
            message: `Boas vindas ${data.email}`,
            duration: 3000
          })).present();
        } else {
          (await this.toastCtrl.create({
            message: 'Não foi possível autenticar.',
            duration: 3000
          })).present();
        }
      });
    }


    async showAdd(){
      const alert = await this.alertCtrl.create({
  
        header: 'O que deseja fazer?',
  
        inputs: [
          {
            name: 'newTask',
            type: 'text',
            placeholder: 'O que deseja fazer?'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Add',
            handler: (form) => {
              console.log(form.newTask);
              this.add(form.newTask);
              this.taskPesquisa = this.tasks;
            }
          }
        ]
      });
      
      await alert.present();
    }
  
    async instructions(){
      const alert = await this.alertCtrl.create({
  
        header: 'Instruções',
        message: 'Aperte em + para adicionar uma tarefa, aperte em cima dela para concluir ou deslize para a esquerda para apagá-la.',
        buttons: ['Ok'],
      });
      
      await alert.present();
    }
  
    async add(newTask : string){
      if (newTask.trim().length < 1){
        const toast = await this.toastCtrl.create({
          message: "Informe o que deseja fazer!",
          duration: 2000,
          position : "top"
        });
  
        toast.present();
        return;
      }
  
      let task = {name : newTask, done: false};
  
      this.tasks.push(task);
  
      this.updateLocalStorage();
  
    }
  
    updateLocalStorage(){
      localStorage.setItem('taskDB', JSON.stringify(this.tasks));
    }
  
    async openActions(task : any){
      const actionSheet = await this.actionSheet.create({
        header: "O que deseja fazer?",
        buttons: [{
          text: task.done ? 'Desmarcar' : 'Marcar',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;
  
            this.updateLocalStorage();
          }
        },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('cancel clicked');
        }
      }]
  
      });
  
      await actionSheet.present();
    }
  
    async delete(task : any){
  
      this.tasks = this.tasks.filter(taskArray => task != taskArray);
  
      this.updateLocalStorage();
  
      this.taskPesquisa = this.tasks;
    }
  
    async ngOnInit(){
      this.taskPesquisa = this.tasks;
  
    }
  
    pesquisa(){
      console.log(localStorage.getItem("taskDB"));
      localStorage.getItem("taskDB").includes(this.nomePesquisa);
      console.log(localStorage.getItem("taskDB").includes(this.nomePesquisa));
  
      console.log(this.tasks);
  
      this.taskPesquisa = this.tasks.filter(tasks => {
        let task : string;
        let nome = this.nomePesquisa.toLowerCase();
        task = tasks.name.toLowerCase();
  
        if(task.includes(nome)){
          return 1;
        }
          })
  
          console.log(this.tasks);
    }

}
