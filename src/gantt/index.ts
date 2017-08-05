
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt.component';

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
export class GanttComponentModule {

}