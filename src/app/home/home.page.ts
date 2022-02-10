import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  tasks : any[] = [];
  searchTerm: string;


  constructor(private alertCtrl : AlertController, 
    private toastCtrl : ToastController, 
    private actionSheet : ActionSheetController,) {
    let taskJson = localStorage.getItem("taskDB")

    if (taskJson!=null){
      this.tasks = JSON.parse(taskJson);
    }

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
  }

  

}
