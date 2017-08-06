/**
 * Gantt Chart Configuration Options
 */
export interface GanttConfiguration{
    /**
     * Width of the grid layout
     */
    grid_width?: number;
    /**
     * Date format for the chart
     */
    xml_date?: string;
    /**
     * show/hide the scale chart (right side layout)
     */
    show_chart?: boolean;
    /**
     * show/hide the grid chart (left side layout)
     */
    show_grid?: boolean;
    /**
     * Time unit scale (day|week|month|year)
     */
    scale_unit?: string;
    /**
     * scale_unit intervals for various time scales
     * Default for each scale is 1 
     */
    step?:{
        hour?:number,
        day?: number,
        week?: number,
        month?:number,
        year?:number
    };
    /**
     * Scale (right side) date format 
     *     exp: "%M %d"
     */
    date_scale?: string;
    /**
     * Grid (left side) date format
     *      exp: "%m/%d/%Y",
     */
    date_grid?: string;
    /**
     * Allow dragable items within its own parent
     */
    order_branch?: boolean;
    /**
     * All dragable items at and into any level
     */
    order_branch_free?: boolean;
    /**
     * Allow sortable columns for the Grid layout (left side)
     */
    sort?: boolean;
    /**
     * Set the Title for chart
     * Required
     */
    chartTitle?: string;
    /**
     * Have the Tasks with children open initially
     */
    open_tree_initially?: boolean;
    /**
     * Enable/Disable the ability to modify the chart
     * Note: Does not apply if using outside methods to modify the chart
     * @todo Check if this is set to true if methods like updateTask still work
     */
    readonly?: boolean;
    /**
     * Adjust the hight of each row
     */
    row_height?: number; //changes the height of the rows
    /**
     * Change the background
     * @todo figure out how this works
     */
    static_background?:boolean;
    /**
     * modify the hieght of the lightbo
     */
    lightbox_additional_height?: number;
    /**
     * Add the desired Time scale controls
     * @todo abstract to be an object with the desired scales
     */
    controls?:{
        hour?:boolean,
        day?:boolean,
        week?:boolean,
        month?:boolean,
        year?:boolean
    };
    /**
     * Fields to add to the popup lightbox for adding/updating task
     * If adding custom fields you must provide those fields in custom_lightbox_fields
     */
    popUpFields?:{title?:boolean,description?:boolean,units?:boolean,timetable?:boolean},
    /**
     * Enable the use of the default lightbox feature to update/view tasks details on double click
     */
    details_on_dblclick?:boolean,
    /**
     * Allow the ability to delete tasks
     */
    allow_delete?:boolean,
    /**
     * Enable the use of the default lightbox feature to update tasks on single click
     */
    allow_click_for_details?:boolean,
    /**
     * Array of custom fields for the lightbox of adding/updating tasks
     * The name value is the the value to add the popUpFields with a value of true to add to 
     * the lightbox
     */
    custom_lightbox_fields?:Array<{name:string, height?:number, map_to:string, type:string, template?:Function,label:string}>,
    /**
     * Enable re render when adding new tasks that don't fit in current time scale view
     */
    fit_tasks?:boolean;
    /**
     * Heading for the first column of the grid area. 
     * Default is "Tasks"
     */
    heading_label?: string;
    /**
     * Show the Label for the current displayed timescale
     * Butons get an active class by default
     */
    time_scale_label?:boolean;
    /**
     * Option to disable the default lightbox for adding a task and use a custom method.
     * When this option is enabled the CreateNewTask event is enabled and can be used like...
     * (CreateNewTask)="myCustomHandler($event)"
     */
    enable_custom_new_task?:boolean;
    /**
     * Array of Buttons to add to the right side of lightbox
     * BuiltIn: [
     * complete_button: marks an item completed updates progress to 1,
     * dhx_delete_btn: deletes an item from the task list
     * ]
     * Note: each of these need to be handled to save the new state in a database
     */
    lightbox_buttons?: Array<string>;
    /**
     * Custom button definitions.
     * each button must have a name in pascal case and a callback function
     * Adding a custom button automatically adds it to the lightbox
     */
    lightbox_custom_buttons?: Array<{name:string, label:string, callback: (button_id:string, el?:any, event?:any)=>void}>;
    /**
     * Enable the ability for parent Tasks to update their own incrimental progress. 
     */
    independant_progress_update?:boolean;
    /**
     * Columns to add to the grid layout area
     * Default choices are
     * ["title", "start_date", "end_date", "progress", "add_button"]
     */
    grid_columns?:Array<string>;
    /**
     * Arrray of Custom Columns to add to the Grid layout area
     */
    custom_grid_columns?:Array<{id:string,definition:{name:string, label: string, align?:string, width:number, template:(task:any)=>string}}>;
    /**
     * enable/disable the ability to drag a task to change the timeline
     * by default it is enabled :true
     */
    drag_move?:boolean;
    /**
     * enable/disable the bility to drag a task progress meter 
     * by default it is enabled :true
     */
    drag_progress?:boolean;
    /**
     * enable/disable the ability to resize a task bar changing the start or end dates
     * by default it is enabled :true
     */
    drag_resize?:boolean;
    /**
     * Text for the right side of the task items in the timeline area
     */
    rightside_text?:(start:Date, end:Date, task:Object)=>string;
    /**
     * Text for the left side of the task items in the timeline area
     */
    leftside_text?:(start:Date, end:Date, task:Object)=>string;
    /**
     * Text for the the completed part of the task bar
     */
    progress_text?:(start:Date, end:Date, task:Object)=>string;
    /**
     * Enable the ability for the Gantt Component to automatically reschedule all children tasks
     * based on the timeline changes from a parent task.
     * Disabled by default
     */
    auto_schedule_enable?:boolean;
}