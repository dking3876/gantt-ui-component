import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter, Renderer, ViewEncapsulation } from "@angular/core";

import "dhtmlx-gantt";
import {} from "@types/dhtmlxgantt";

import { GanttTaskItem, GanttTaskLink } from './task';
import { GanttEvents } from './gantt.definitions';
import { GanttConfiguration } from './gantt.configuration.interface';
@Component({
    selector: "gantt",
    providers: [],
    styleUrls: ['./gantt.scss'],
    template: `
    <div class="gantt_main_header">
        <h3 *ngIf="config.chartTitle">{{ chartTitle }}</h3>
        <div class="gantt_controls" *ngIf="config.controls">
            <label *ngIf="config.time_scale_label">Time Scale: {{ currentDateScale | titlecase }}</label>
            <div class="gantt_controls_buttons">
                <button #hour (click)="changeDepth('hour', $event)" *ngIf="config.controls.hour" [ngClass]="{active: currentDateScale == 'hour'}">Hours</button>
                <button #day (click)="changeDepth('day', $event)" *ngIf="config.controls.day" [ngClass]="{active: currentDateScale == 'day'}">Days</button>
                <button #week (click)="changeDepth('week', $event)" *ngIf="config.controls.week" [ngClass]="{active: currentDateScale == 'week'}">Weeks</button>
                <button #month (click)="changeDepth('month', $event)" *ngIf="config.controls.month" [ngClass]="{active: currentDateScale == 'month'}">Months</button>
                <button #year (click)="changeDepth('year', $event)" *ngIf="config.controls.year" [ngClass]="{active: currentDateScale == 'year'}">Years</button>
            </div>
        </div>
    </div>
    <div class="containing_container">
    <div #gantt_here class="dking_gantt" style='width: 100%; height: 100%;'></div>
    </div>`,
    encapsulation: ViewEncapsulation.None
})
export class GanttComponent implements OnInit {
    @ViewChild("gantt_here") ganttContainer: ElementRef;

    /**
     * Gantt Object
     */
    private gantt: GanttStatic = gantt;
    /**
     * Title for the chart
     */
    private chartTitle: string;
    /**
     * Column heading for the milestone/phases
     */
    private headingLabel = "Tasks";
    /**
     * Input of the milestones/phases/tasks
     * Array<Milestones>
     */
    @Input('tasks') tasks:Array<GanttTaskItem> = [];
    /**
     * Input of the "links" between milestones/phases/tasks
     * Array<Objects> 
     */
    @Input('links') taskLinks:Array<GanttTaskLink> = [];
    /**
     * User supplied Configuration
     */
    @Input('config') userConfig :GanttConfiguration;
    /**
     * Default configuration
     */
    private config: GanttConfiguration = {
        
        grid_width: 500,
        xml_date: "%Y-%m-%d %H:%i",
        show_chart: true,
        scale_unit: "week",
        step: {},
        date_scale: "%M %d",
        date_grid: "%m/%d/%Y",
        sort: true,
        open_tree_initially: true,
        lightbox_additional_height: 100,
        controls: {
            day:true,
            week:true,
            month:true
        },
        popUpFields: {title: true, description:true ,timetable:true},
        fit_tasks: true,
        details_on_dblclick: false,
        lightbox_buttons: ["dhx_delete_btn"],
        lightbox_custom_buttons: [],
        independant_progress_update: false,
        grid_columns: ["title", "start_date", "end_date", "progress", "add_button"]
    };
    /**
     * fires when a task action has taken place. these include
     * when a task has been created, updated, or deleted
     */
    @Output() TaskAction: EventEmitter<any> = new EventEmitter();
    /**
     * Fires when a task is doubleclicked to select it
     */
    @Output() TaskSelected: EventEmitter<any> = new EventEmitter();
    /**
     * fires when a link action has taken place. these include
     * when a link has been created, updated, or deleted
     */
    @Output() LinkAction: EventEmitter<any> = new EventEmitter();
    /**
     * Fires when a link has been clicked to select it
     */
    @Output() LinkSelected: EventEmitter<any> = new EventEmitter();
    /**
     * Fires when a user clicks the '+' icon next to a task to create a 
     * new task.
     */
    @Output() CreateNewTask: EventEmitter<any> = new EventEmitter();
    /**
     * The current time Scale being used
     */
    private currentDateScale;

    constructor(private _renderer: Renderer, private _elementRef: ElementRef){
        // this.gantt = Object.assign({}, gantt)
    }

    ngOnInit(){
        // console.log(gantt);
        // this.gantt = Object.create(gantt);
        console.log("gant init");
        //Merge the incomming configuration options with the default configuration
        Object.assign(this.config, this.userConfig);

        this.configureChart();
        this.modifyGridArea();
        this.modifyScalesArea();
        this.modifyLightboxArea();

        
        this.gantt.init(this.ganttContainer.nativeElement);
        
        this.gantt.attachEvent("onBeforeTaskAdd", this.onBeforeAddMilestone);

        this.gantt.attachEvent("onAfterTaskAdd", (id, task)=>{
            this.TaskAction.emit({
                action: GanttEvents.newTask,
                task
            })
        });
        this.gantt.attachEvent("onBeforeTaskMove", (sid, parent,index)=>{
            console.log("before task move", sid, parent, index);
            console.log(Object.assign({}, this.gantt.getTask(sid)));
        })
        this.gantt.attachEvent("onTaskClick", (id, event)=>{ //when the event is clicked...does not apply to moving
            console.log("before any data is changed");
            console.log(Object.assign({}, this.gantt.getTask(id)));

        })
        this.gantt.attachEvent("onBeforeTaskDrag", (id, mode, event)=>{
            console.log("before any data is changed");
            console.log(Object.assign({}, this.gantt.getTask(id)));
        })
        this.gantt.attachEvent("onBeforeTaskChanged", (id, mode, task)=>{
            this.autoShedule(id, task);
            if(mode == 'progress' && this.gantt.hasChild(id) && !this.config.independant_progress_update){
                console.log("this task has children and can't modify its progress on its own");
                return false;
            }
            return true;
        })
        this.gantt.attachEvent("onBeforeTaskSelected", (id)=>{

        })
        this.gantt.attachEvent("onBeforeTaskUpdate", (id, task)=>{

        })
        this.gantt.attachEvent("onAfterTaskUpdate" ,(id, task)=>{
            console.log("after task update", task);
            this.calculateParentProgress(id);
            this.autoShedule(id, task);
            this.TaskAction.emit({
                action: GanttEvents.updateTask,
                task
            });
            return true;
        });        
        this.gantt.attachEvent("onAfterTaskDelete", (id)=>{
            
            this.TaskAction.emit({
                action: GanttEvents.deleteTask,
                id: id
            })
        });
        this.gantt.attachEvent("onAfterTaskMove",(id, task)=>{
            this.TaskAction.emit({
                action: GanttEvents.updateTask,
                task
            });
            return true;
        });
        this.gantt.attachEvent("onTaskDblClick", (id, e)=>{
            if(this.config.readonly){
                return false;
            }
            this.TaskSelected.emit({
                action: GanttEvents.taskSelected,
                id: id,
                event: e
            })  
            return true;
        })
        this.gantt.attachEvent("onMouseMove", (id, e)=>{
        })
        this.gantt.attachEvent("onAfterLinkAdd",(id, connection)=>{
            this.LinkAction.emit({
                action: GanttEvents.newLink,
                link: connection
            })
            return true;
        });
        this.gantt.attachEvent("onAfterLinkUpdate",(id, connection)=>{
            
            this.LinkAction.emit({
                action: GanttEvents.updateLink,
                link: connection
            })
        });
        this.gantt.attachEvent("onAfterLinkDelete", (id)=>{
            
            this.LinkAction.emit({
                action: GanttEvents.deleteLink,
                id: id
            })
        });
        this.gantt.attachEvent("onLinkClick", (id, e)=>{
            if(this.config.readonly){
                return false;
            }
            this.LinkSelected.emit({
                action: GanttEvents.linkSelected,
                id: id,
                event: e
            })
        })
        this.gantt.attachEvent("onTaskCreated", (empty_task)=>{ //fires when the plus sign is clicked
            if(this.config.readonly){ //if read only can add nothing
                return false;
            }
            if(this.config.enable_custom_new_task){
                this.CreateNewTask.emit({
                    action: GanttEvents.createNewTask,
                    parent: empty_task.parent,
                    auto_generated_id: empty_task.id
                });
                return false
            }
            return true;
        })
        this.gantt.attachEvent("onLightboxButton", this.onLightboxButtonClick);

        this.gantt.attachEvent("onError", (error)=>{
            console.log("Gantt UI Component error: ",error);
        })
        this.gantt.clearAll();
        //  this.gantt.parse({data:this.tasks, links: this.taskLinks})
        Promise.all([this.tasks, this.taskLinks])
            .then(([data, links]) => {
                this.gantt.parse({data, links});
            });
             
    }
    /**
     * Configure the Chart
     */
    private configureChart(){
        for(let setting in this.config){
            this.gantt.config[setting] = this.config[setting];
        }
        this.gantt.config.step = this.config.step[this.config.scale_unit] | 1;
        this.chartTitle = this.config.chartTitle;
        this.headingLabel = this.config.heading_label? this.config.heading_label: this.headingLabel;
        this.currentDateScale = this.config.scale_unit;
    }
    /**
     * Setup the Grid side area with the desired columns
     */
    private setUpGridArea(){
        let default_columns = { 
            title: {name:"title",  label: this.headingLabel,  width:"*", tree:true },
            start_date: {name:"start_date", label:"Start Date", align: "center", width: 100},
            end_date: {name:"end_date", label:"End Date", align: "center" , width: 100},
            progress: {name:"progress",   label:"%",   align: "center", width: 44, template: (task)=>{
                let percent = ( (task.progress?task.progress:0) * 100);
                return (percent == 100? percent : percent.toPrecision(2) ) +'%';
            }},
            add_button: {name:"add", label:"", width:44}
        };
        
        let columns = [];
        this.config.grid_columns.forEach(column=>{
            columns.push(default_columns[column])
        })
        return columns;

    }
    /**
     * Modify the left side listing of Milestones/phases/tasks ect
     */
    private modifyGridArea(){

        this.gantt.config.columns = this.setUpGridArea();


        this.gantt.templates.grid_file = (item)=>{
            let file = '<div class="gantt_tree_icon gantt_grid_icon_indicator">';
            if(item.progress >= 1){
                return file +'<i class="material-icons milestone_completed">check_circle</i></div>';
            }
            if(new Date() > item.end_date){
                return file +'<i class="material-icons milestone_overdue">warning</i></div>';
            }
            //gantt_file (default)
            return file + '<i class="material-icons">web_asset</i></div>';
        }
        this.gantt.templates.grid_folder = (item)=>{
            let file = '<div class="gantt_tree_icon gantt_grid_icon_indicator">';
            if(item.progress >=1){
                return file + '<i class="material-icons milestone_completed">check_circle</i></div>';
            }
            if(item.$open){
                return file + '<i class="material-icons">clear_all</i></div>';
            }
            return file + '<i class="material-icons">menu</i></div>';
        }
    }

    /**
     * Modify the right side scales/tasks area
     */
    private modifyScalesArea(){
        // determine what class to apply to the task bar
        this.gantt.templates.task_class = (start_date,end_date,task)=>{
            return "";
        }
        this.gantt.templates.task_text= (start,end,task)=>{
            return task.title;
        };
        this.gantt.templates.scale_cell_class = (date)=>{ //Highlight weekend days
            
            if(this.currentDateScale == 'day' && (date.getDay()==0||date.getDay()==6)){ return "weekend"; }
        };
        this.gantt.templates.task_cell_class = (item,date)=>{ //Hightlight weekend days
            
            if(this.currentDateScale == 'day' && (date.getDay()==0||date.getDay()==6)){ return "weekend"; }
        };
        this.gantt.templates.link_description = (link)=>{
            let from = this.gantt.getTask(link.source),
                to = this.gantt.getTask(link.target);
            return `<b>${from.title}</b> - <b>${to.title}</b>`;
        }

        this.gantt.templates.drag_link = (from, from_start, to, to_start)=>{
                let source = this.gantt.getTask(from)
                let txt = `From: <b>${source.title}</b>`;
                if(to){
                    let target = this.gantt.getTask(to);
                    txt += ` To: <b>${target.title}</b>`;
                }
                
            return txt;
        }
        if(this.config.leftside_text){
            this.gantt.templates.leftside_text = this.config.leftside_text;
        }
        if(this.config.rightside_text){
            this.gantt.templates.rightside_text = this.config.rightside_text;
        }
        if(this.config.progress_text){
            this.gantt.templates.progress_text = this.config.progress_text;
        }
    }
    /**
     * Setup the default lightbox option with the desired fields
     */
    private setUpLightBox(){
        let templates = {
            title: {name:"title", height:28, map_to:"title", type:"textarea"},
            description: {name:"description", height:70, map_to:"description", type:"textarea"},
            timetable: {name:"timetable",height: 20, map_to:"auto", type:"time"},
            starttime: {name:"time", height:72, map_to:"auto", type:"duration"},
            placeholder: {name:"odd", height: 5, map_to:"", type: "textarea"}
        };
        if(this.config.custom_lightbox_fields){
            this.config.custom_lightbox_fields.forEach( (field)=>{
                templates[field['name']] = field;
                this.gantt.locale.labels["section_"+field['name']] = field['label'];
            })
        }
        let section = [];
        for(let field in this.config.popUpFields){
            section.push(templates[field]);
        }
        section.push(templates["placeholder"]);
        return section;
    }
    /**
     * Setup the default lightbox option with the desired buttons
     */
    private setUpLightBoxButtons(){
        let buttons = {
            delete: "dhx_delete_btn",
            complete: "complete_button"
        }
        let desired_buttons = [];
        this.config.lightbox_buttons.forEach((btn)=>{
            desired_buttons.push(btn);
        });
        this.config.lightbox_custom_buttons.forEach((btn)=>{
            desired_buttons.push(btn.name);
            this.gantt.locale.labels[btn.name] = btn.label;
        })
        return desired_buttons;
    }
    /**
     * Modify the popup for creating/editing a milestone/task/phase
     */
    private modifyLightboxArea(){
        this.gantt.config.lightbox.sections=this.setUpLightBox();

        this.gantt.locale.labels['section_title'] = "Title<span style='color:red'>*</span><span style='color:red;font-size:.75em'>required</span>";
        this.gantt.locale.labels['section_timetable'] = "Time Frame";
        this.gantt.config.buttons_right=this.setUpLightBoxButtons();  //ID
        this.gantt.locale.labels["complete_button"] = "Mark Completed"; //Text of the button
        this.gantt.locale.labels["section_odd"] = "";

        this.gantt.templates.lightbox_header = (start, end, task)=>{
            
            return '<h3 style="margin:0px 10px 0px 0px;display:inline-block">'+  (task.title? task.title: "New Milestone") + '</h3>' + this.gantt.templates.task_time(task.start_date, task.end_date, task);
        }
        
    }
    /**
     * Checks if the task being modified is a parent task and auto schedules the children accordingly
     * @param id 
     * @param task 
     */
    private autoShedule(id, task){
        //if this is the parent of something, adjust all the kids automatically
        let kids = this.gantt.getChildren(id);
        if(kids.length === 0){
            return;
        }


    }
    /**
     * Hook to ensure the newly created Task has the title field filled out
     * @param id Id of the task being added
     * @param task Freshly created task object
     */
    private onBeforeAddMilestone(id, task){
        //check if all fields are filled out
        if(!(task.title)){ // ensure title has been filled out
            return false;
        }
        if(task.units){ // ensure units are a number
            return !isNaN(task.units);
        }
        return true;
    }
    /**
     * Hook for when a button is clicked using the default lightbox 
     * applies custom button actions here
     * @param button_id string : String identifictaion of the button that was clicked
     * @param el HTMLEntity
     * @param event Dom Event
     */
    public onLightboxButtonClick(button_id, el, event){
        if(button_id == "complete_button"){
            var id = this.gantt.getState().lightbox;
            this.gantt.getTask(id).progress = 1;
            this.gantt.updateTask(id);
            this.gantt.hideLightbox();
        }
        this.config.lightbox_custom_buttons.find(btn=>{
            return btn.name == button_id
        }).callback(button_id, el, event);
    }
    /**
     * 
     * @param depth Depth of the scale (day/week/month/year)
     */
    private changeDepth(depth, el:any){
        // let parent = el.target.parentNode.children;
        // for(let child of parent){
        //     this._renderer.setElementClass(el.target, "active", false);    
        // }
        // this._renderer.setElementClass(el.target, "active", true);
        this.gantt.config.scale_unit = this.currentDateScale = depth;
        switch(depth){
            case 'hour':
            this.gantt.config.step = this.config.step.hour | 1;
            this.gantt.config.date_scale = "%g:%i %a";
            break;
            case 'day':
            this.gantt.config.step = this.config.step.day | 1;
            this.gantt.config.date_scale = "%M %d";
            break;
            case 'week':
            this.gantt.config.step = this.config.step.week | 1;
            this.gantt.config.date_scale = "%M %j";
            break;
            case 'month':
            this.gantt.config.step = this.config.step.month | 1;
            this.gantt.config.date_scale = "%M %Y";
            break;
            case 'year':
            this.gantt.config.step = this.config.step.year | 1;
            this.gantt.config.date_scale = "%Y";
            default:
            this.gantt.config.step = this.config.step.year | 1;
            break;
        }
        this.gantt.render();
    }
    /**
     * Calcaulate the parent progress based on the progress of the children
     * @param id string | number
     */
    private calculateParentProgress(id){
        let p_id = this.gantt.getParent(id);
        if(p_id){
            let parent = this.gantt.getTask(this.gantt.getParent(id));
            let children = this.gantt.getChildren(p_id); //array of ids
            let total_children = children.length;
            let total_progress = 0;
            for(let kid_id of children){
                let kid_progress = this.gantt.getTask(kid_id).progress;
                total_progress += (kid_progress / total_children);
            }
            parent.progress = total_progress;
            this.gantt.updateTask(parent.id);
        }
    }
    /**
     * Exposed method for changing the Task ID
     * @param old_id string|number
     * @param new_id string|number
     */
    public updateTaskId(old_id: string|number, new_id: string|number){
        this.gantt.changeTaskId(old_id, new_id);
    }
    /**
     * Exposed method for adding a new Task
     * @param task Task|Object
     */
    public addNewTask(task:GanttTaskItem){
        this.gantt.addTask(task, task.parent);
    }
    /**
     * Exposed Method for updating an existing Task
     * @param taskId string|number
     * @param task Task|Object
     */
    public updateTask(taskId: any,task:GanttTaskItem){
        for(let key in task){
            this.gantt.getTask(taskId)[key] = task[key];
        }
        this.gantt.updateTask(taskId);
    }
    /**
     * Exposed method for removing an existing Task from the chart
     * @param taskId string|number
     */
    public removeTask(taskId){
        this.gantt.deleteTask(taskId);
    }
    /**
     * Exposed method for creating a link between tasks
     * NOTE: it is not recommended to use this as you will need
     * to identify type of link
     * @todo create and export Link type enum
     * @param taskLink TaskLink|Object
     */
    public addNewTaskLink(taskLink:GanttTaskLink){
        return this.gantt.addLink(taskLink);
    }
    /**
     * Exposed method for hard refresh of the chart
     */
    public hardRefresh(){
        this.gantt.render();
    }
}