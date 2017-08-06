import { Component } from '@angular/core';
import {GanttComponent, GanttConfiguration, GanttTaskItem, GanttTaskLink,GanttEvents } from 'gantt-ui-component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gantt Test App';
  tasks = [
        {id: 1, title: "Task #1", start_date: "2017-08-01 00:00", end_date: "2017-08-30", progress: 0.6},
        {id: 2, title: "Task #2", start_date: "2017-08-18 00:00", duration: 3, progress: 0.4, type: 1},
        {id: 3, title: "Task #3", start_date: "2017-08-20 00:00", end_date: "2017-08-21", progress: 0.3},
        {id: 4, title: "Task #4", start_date: "2017-08-18 00:00", duration: 23, progress: 0.4},
        {id: 5, title: "Task #5", start_date: "2017-08-15 00:00", end_date: "2017-08-30", progress: 0},
        {id: 6, title: "Task #6", start_date: "2017-08-15 00:00", end_date: "2017-08-21",parent: 5, progress: 0},
        {id: 7, title: "Task #7", start_date: "2017-08-21 00:00", end_date: "2017-08-30",parent: 5, progress: 0},
  ];
  links = [

  ];
  gantt_configuration: GanttConfiguration = {
        chartTitle: "Project Phases and Milestones",
        heading_label: "Milestones/Phases",
        // enable_custom_new_task: true,
        details_on_dblclick: true,
        custom_lightbox_fields:[{name:"units", height: 28, map_to:"units", type: "textarea", label:"Allocated Units <span style='font-size:.75em'>(leave blank if none)</span>"}],
        popUpFields: {title: true, description:true ,timetable:true, units:true},
        leftside_text: (s,e,t)=>{
            return "left side text";
        },
        progress_text: (s,e,t:any)=>{
          return Math.round(t.progress * 100) + "%";
        },
        rightside_text: (s,e,t)=>{
          return "right side text"
        }
    }
  taskAction($event){
    console.log($event);
  }
  taskSelected($event){
    console.log($event);
  }
  createNewTask($event){
    console.log($event);
  }
  linkAction($event){
    console.log($event);
  }
  linkSelected($event){
    console.log($event);
  }
}
