import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt/gantt.component';

export * from './gantt/gantt.component';
export * from './gantt/task';
export * from './gantt/gantt.definitions';
export * from './gantt/gantt.configuration.interface';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    GanttComponent
  ],
  exports: [
    GanttComponent
  ]
})
export class GanttModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GanttModule
    };
  }
}
