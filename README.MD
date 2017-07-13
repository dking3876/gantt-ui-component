# gantt-ui-component

## Installation

To install this library, run:

```bash
$ npm install gantt-ui-component --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install gantt-ui-component
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { GanttModule } from 'gantt-ui-component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
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
## License

MIT © [Deryk w. King](mailto:dking3876@msn.com)
