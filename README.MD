# gantt-ui-component

## Installation

To install this library, run:

```bash
 npm install gantt-ui-component --save
```

## Peer Dependancies
requires dhtmlx-gantt
```bash
npm install dhtmlx-gantt --save
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import library
import { GanttModule } from 'gantt-ui-component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify as an import
    GanttModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your gantt-ui-component is imported, you can add the chart to your page as follows:

```html
   <gantt [tasks]="tasks" 
          [links]="links" 
          [config]="gantt_configuration" 
          (TaskAction)="taskAction($event)" 
          (TaskSelected)="taskSelected($event)" 
          (CreateNewTask)="createNewTask($event)"
          (LinkAction)="linkAction($event)"
          (LinkSelected)="linkSelected($event)"></gantt>
```
```typescript
import {GanttComponent, GanttConfiguration, GanttTaskItem, GanttTaskLink,GanttEvents } from 'gantt-ui-component';


export myComponent {
    tasks = [
        {id: 1, title: "Task #1", start_date: "2017-06-15 00:00", end_date: "2017-07-03", progress: 0.6},
  ];
  links = [

  ];
  gantt_configuration: GanttConfiguration = {
        chartTitle: "My Great Chart",
        heading_label: "Tasks",
        details_on_dblclick: true,
    }
}
```
## Ouput Events
- TaskAction- Ouputs an event Object for events related to GanttTaskItems
- TaskSelected- Outputs an event Object when a task is double clicked
```
  {
      action: GanttEvents<Enum>,//See definition below
      task, //New or updated Task data
      id, //on taskSelected | deleteTask only
      event //only on taskSelected
  }
```
- CreateNewTask- Outpus an event Object when a new task is added
```
  {
    action: GanttEvents<Enum>.createNewTask, 
    parent,
    auto_generated_id
  }
```
- LinkAction- Outputs an event related to GanttTaskLink
- LinkSelected- Outputs an event Object when a link is double clicked
```
  {
    action: GanttEvents<Enum>, //See definition below
    link, //New or updated Link data
    id, //on LinkSelected | deleteLink only
    event //only on linkSelected
  }
```
```
GanttEvents {
    createNewTask, // when the "plus" is clicked to add a new task
    newTask, // new task has been created 
    updateTask, // a task has been updated
    deleteTask, // a task has been deleted
    taskSelected, // a task has been selected via double click
    newLink, // a new task link has been created
    updateLink, // a link has been update 
    deleteLink, // a link has been deleted
    linkSelected // a link has been selected via double click
}
```

## Complete configuration Options

- grid_width:number - Width of the grid layout  
- xml_date: string - Date format for the chart  
- show_chart: boolean - show/hide the scale chart (right side layout) 
- show_grid: boolean - how/hide the grid chart (left side layout)  
- scale_unit: string Time unit scale (day|week|month|year)
- step:Object - scale_unit intervals for various time scales. Default for each scale is 1  
        ```{ hour?:number,
          day?: number,
          week?: number,
          month?:number,
          year?:number}  ```
- date_scale: string - Scale (right side) date format exp: "%M %d (see Date definitions below)
- date_grid: string - Grid (left side) date format exp: "%m/%d/%Y"
- order_branch: boolean- Allow dragable items within its own parent
- order_branch_free: boolean- All dragable items at and into any level
- sort: boolean- Allow sortable columns for the Grid layout (left side)
- chartTitle: string- Set the Title for chart [REQUIRED]
- open_tree_initially: boolean- Have the Tasks with children open initially
- readonly: boolean- Enable/Disable the ability to modify the chart Note: Does not apply if using outside methods to modify the chart
- row_height: number- Adjust the hight of each row
- static_background:boolean- Change the background
- lightbox_additional_height: number- modify the hieght of the lightbox
- controls:Object- Add the desired Time scale controls  
      ```{  
       hour?:boolean,
        day?:boolean,
        week?:boolean,
        month?:boolean,
        year?:boolean
    }```
- popUpFields:Object- Fields to add to the popup lightbox for adding/updating task  
If adding custom fields you must provide those fields definitions in custom_lightbox_fields property
```{title?:boolean,description?:boolean,units?:boolean,timetable?:boolean}```
- custom_lightbox_fields:Array\<Object>- Array of custom fields for the lightbox of adding/updating tasks The name value is the the value to add the popUpFields with a value of true to add to the lightbox
```
[
  {
    name:string, 
    height?:number, 
    map_to:string, 
    type:string, 
    template?:()=>string,
    label:string
    }
]
```
- details_on_dblclick:boolean,- Enable/disable the use of the default lightbox feature to update/view tasks details on double click Defaults to true
- allow_delete:boolean- Allow the ability to delete tasks
- allow_click_for_details:boolean-  Enable the use of the default lightbox feature to update tasks on single click defaults to true
- fit_tasks?:boolean- Enable re render when adding new tasks that don't fit in current time scale view
- heading_label: string- Heading for the first column of the grid area. Default is "Tasks"
- time_scale_label?:boolean- Show the Label for the current displayed timescale
- enable_custom_new_task:boolean- Option to disable the default lightbox for adding a task and use a custom method. When this option is enabled the CreateNewTask event is enabled and can be used like:
```html
<gantt (CreateNewTask)="myCustomHandler($event)"> </gantt>
```
- lightbox_buttons?: Array\<string>- Array of Buttons to add to the right side of lightbox  
     BuiltIn: [  
      complete_button: marks an item completed updates progress to 1,  
      dhx_delete_btn: deletes an item from the task list  
      ]
- lightbox_custom_buttons: Array\<Object>- Custom button definitions. each button must have a name in pascal case and a callback function. Adding a custom button automatically adds it to the lightbox  
```
  [
    {
      name:string,
      label:string, 
      callback: (button_id:string, el?:any, event?:any)=>void
    }
  ]
```
- independant_progress_update:boolean-Enable the ability for parent Tasks to update their own incrimental progress. By default this is disabled. 
- grid_columns:Array\<string>- Columns to add to the grid layout area Default choices are
```["title", "start_date", "end_date", "progress", "add_button"]```
- custom_grid_columns:Array\<Object>- Arrray of Custom Columns to add to the Grid layout area
```bash
[
  {
    id:string, #Unique identifer
    definition:{
      name:string, #name of your field (no spaces all lowercase)
      label: string, #visible name of the coloumn
      align?:string,  #text align of hte column
      width:number,  #width in pixels of the column
      template:(task:any)=>string #method of returning the value of each
    }
  }
]
```
- drag_move:boolean- enable/disable the ability to drag a task to change the timeline by default it is enabled :true
- drag_progress:boolean- enable/disable the bility to drag a task progress meter by default it is enabled :true
- drag_resize:boolean- enable/disable the ability to resize a task bar changing the start or end dates by default it is enabled :true
- rightside_text:Function- Text for the right side of the task items in the timeline area
```
  (start:Date, end:Date, task:Object)=>string
```
- leftside_text:Function - Text for the left side of the task items in the timeline area
```
  (start:Date, end:Date, task:Object)=>string
```
- progress_text:Function- Text for the the completed part of the task bar
```
  (start:Date, end:Date, task:Object)=>string
```
- auto_schedule_enable:boolean- Enable the ability for the Gantt Component to automatically reschedule all children tasks based on the timeline changes from a parent task. Disabled by default

## Date and Time definitions
%y - the year as a two-digit number ( 00 to 99 );  
%Y - the year as a four-digit number ( 1900-9999 );   

%m - the month as a number with a leading zero ( 01 to 12 );  
%n - the month as a number without a leading zero ( 1 to 12 );  
%M - the month as an abbreviation ( Jan to Dec );  
%F - the month as a full name ( January to December );   

%W - the ISO-8601 week number of the year. Weeks start on Monday;   

%d - the day as a number with a leading zero ( 01 to 31 );  
%j - the day as a number without a leading zero ( 1 to 31 );  
%D - the day as an abbreviation ( Sun to Sat );  
%l - the day as a full name ( Sunday to Saturday );   

%h - the hour based on the 12-hour clock ( 00 to 11 );  
%H - the hour based on the 24-hour clock ( 00 to 23 );  
%g - the hour based on the 12-hour clock without a leading zero ( 1 to 12 );  
%G - the hour based on the 24-hour clock without a leading zero ( 0 to 23 );   

%i - the minute as a number with a leading zero ( 00 to 59 );  
%s - the second as a number with a leading zero ( 00 to 59 );  
%a - displays am (for times from midnight until noon) and pm (for times from noon until midnight);  
%A - displays AM (for times from midnight until noon) and PM (for times from noon until midnight).  

## ChangeLog
0.2.1 - Aug 2017
- Added a new entry to the GanttEvents enum "createNewTask" to replace the string "create new task" for the action of the (createNewTask) Output event
- exposed leftside_text, rightside_text, and progress_text on the gantt configuration
- exposed configuration to disable/enable the ability to modify tasks via the timeline interface
- Added a method to autoschedule child tasks based on timeline changes to the parent
- Added a configurtion flag to enable the use of autoschedule
## License

MIT © [Deryk w. King](mailto:dking3876@msn.com)
