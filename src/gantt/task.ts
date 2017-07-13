export class GanttTaskItem {
    id?: number|string;
    start_date: string;
    end_date?:string;
    text?: string;
    progress?: number;
    duration?: number;
    parent?: any;
    title: string;
}
export class GanttTaskLink {
    id: number|string;
    source: number|string;
    target: number|string;
    type: GanttTaskLinkType|number;
}
export enum GanttTaskLinkType {
    finish_to_start,
    start_to_start,
    finish_to_finish,
    start_to_finish
}