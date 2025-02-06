import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { JsonService } from 'src/app/services/json/json.service';

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

  taskList: any[] = [];

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
    const data = await this.jsonSerivce.readJsonFile<{ tasks: any[] }>(
      '../../../assets/json/tasks.json'
    )
    this.taskList = data.tasks;

  }
}
