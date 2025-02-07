import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { JsonService } from 'src/app/services/json/json.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'; 

interface Task {
  id: number;
  task: string;
  details: string;
  timeRange: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
})
export class HomePage {
  selectedDate: string = "";
  today: Date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

  taskList: Task[] = [];
  isEditing: boolean = false;

  constructor(
    private jsonSerivce: JsonService
  ) {
    this.selectedDate = this.today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  async ngOnInit() {
    await this.loadTasks();
    
    console.log("TASKS: ", this.taskList);
  }

  async loadTasks() {
    const data = await this.jsonSerivce.readJsonFile<{ tasks: Task[] }>(
      '../../../assets/json/tasks.json'
    )
    this.taskList = data.tasks;
  }

  addTask() {
    const newTask: Task = {
      id: this.taskList.length ? Math.max(...this.taskList.map(t => t.id)) + 1 : 1,
      task: '',
      details: '',
      timeRange: ''
    }
  }

  editTask(taskId: number) {
    const selectedTaskDiv = document.getElementById(`task${taskId}`);

    if (selectedTaskDiv) {
      const inputs = selectedTaskDiv.querySelectorAll("ion-input");

      inputs.forEach((input) => {
        input.disabled = false;
      });

      selectedTaskDiv.querySelector("ion-icon[name='create']")?.classList.add('hidden');
      selectedTaskDiv.querySelector("ion-icon[name='heart']")?.classList.remove('hidden');
    }
  }

  saveTask(taskId: number) {
    const selectedTaskDiv = document.getElementById(`task${taskId}`);

    if (selectedTaskDiv) {
      const taskName = selectedTaskDiv?.querySelector("ion-input[name='task']") as HTMLIonInputElement;
      const taskDetails = selectedTaskDiv?.querySelector("ion-input[name='details']") as HTMLIonInputElement;
      const taskTimeRange = selectedTaskDiv?.querySelector("ion-input[name='timeRange']") as HTMLIonInputElement;

      taskName?.getInputElement().then(input => console.log("Task Name:", input.value));
      taskDetails?.getInputElement().then(input => console.log("Details:", input.value));
      taskTimeRange?.getInputElement().then(input => console.log("Time Range:", input.value));

      if (taskName && taskDetails && taskTimeRange) {
        Promise.all([
          taskName.getInputElement(),
          taskDetails.getInputElement(),
          taskTimeRange.getInputElement(),
        ]).then(([taskElement, detailsElement, timeRangeElement]) => {
          if (taskElement && detailsElement && timeRangeElement) {
            const updatedTask = {
              id: taskId,
              task: taskElement.value,
              details: detailsElement.value,
              timeRange: timeRangeElement.value
            };
  
            // Find and update the task in `taskList`
            const index = this.taskList.findIndex(t => t.id === taskId);
            if (index !== -1) {
              this.taskList[index] = updatedTask;

              const jsonString = JSON.stringify({ tasks: this.taskList });

              console.log(jsonString);

              const filePath = '../../../assets/json/tasks.json';``

              Filesystem.writeFile({
                path: './assets/json/tasks.json',
                data: jsonString,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
              }).then(()=>{
                console.log("Saved");
              }).catch(err => {
                console.error("Error saving task file:", err)
              })
            }
          }
        });
      }
    }
  }
}
