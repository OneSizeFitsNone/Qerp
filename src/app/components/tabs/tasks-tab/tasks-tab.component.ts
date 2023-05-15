import { Time } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IContact } from 'src/app/interfaces/contact';
import { IMilestone } from 'src/app/interfaces/milestone';
import { ITask } from 'src/app/interfaces/task';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { TaskService } from 'src/app/services/pm/task/task.service';
import { MilestonesService } from 'src/app/services/tabs/milestones.service';

@Component({
  selector: 'az-tasks-tab',
  templateUrl: './tasks-tab.component.html',
  styleUrls: ['./tasks-tab.component.scss'],
  providers: [TaskService, ContactService, MilestonesService, AppTypes]
})
export class TasksTabComponent {
  @Input() appTypeId: number = null;
  @Input() linkTypeId: number = null;
  @Input() parent: any = null;
  @Output() onUpdateTasks = new EventEmitter<any>();

  private tasks: Array<ITask> = [];
  public tasksSearch: Array<ITask> = [];
  public task: ITask = <ITask>{};

  public ccSearch: string = "";

  public selectedId: number = -1;
  public hasNew: boolean = false;

  public contacts: Array<IContact> = [];
  public contactSearch: string = "";
  public milestones: Array<IMilestone> = [];
  public milestoneSearch: string = "";
  
  constructor(
    public appTypes: AppTypes,
    private ref: ChangeDetectorRef,
    private taskService: TaskService,
    private contactService: ContactService,
    private milestoneService: MilestonesService
  ) {    
  }
  
  ngOnInit() {

    this.taskService.tasks.subscribe(t => {
      this.tasks = t;
      this.onInputChange();
      this.ref.detectChanges();
      this.hasNew = this.tasks.find(cc => cc?.id == 0) ? true : false;
      this.ref.detectChanges();
    });

    this.taskService.task.subscribe(t => {
      if(this.task.id != null && t.id == null) {
        this.onUpdateTasks.emit(true);
      }
      this.task = t;
      this.onSearchContact("");
      if(this.appTypeId == this.appTypes.prospect || this.appTypeId == this.appTypes.project) {
        this.onSearchMilestone("");
      }
    });

    this.contactService.contacts.subscribe(c => { 
      this.contacts = c;
      this.ref.detectChanges();
    });

    this.milestoneService.milestones.subscribe(m => {
      this.milestones = m
      this.ref.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["appTypeId"] || changes["linkTypeId"]) {
      if(this.appTypeId && this.linkTypeId) {
        this.taskService.selectByApptype(this.appTypeId, this.linkTypeId);
      }
    }
  }

  public onInputChange() {
    this.tasksSearch = this.tasks.filter(ms => ms.title.toLowerCase().includes(this.ccSearch.toLowerCase()));
  }

  public onCreateTask() {
    this.taskService.createTask(this.appTypeId, this.linkTypeId, this.parent?.deadline);
  }

  public editTask(oTask: ITask) {
    if(this.hasNew && this.task?.id == 0) {
      this.taskService.deleteTask(this.task);
    }
    this.taskService.getTask(oTask.id);

  }

  public saveTask(oTask: ITask) {
    if(oTask.title) {
      this.taskService.saveTask(oTask, true);
    }    
  }

  public deleteTask(oTask: ITask) {
    this.taskService.deleteTask(oTask);
  }

  public onSearchContact(searchString: string) {
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{}
    oContact.forcedId = this.task.contactId ?? 0;

    if(searchString.length > 3) {
      oContact.fullname = searchString;  
    }

    this.contactService.findUser(oContact);
  }

  public onSearchMilestone(searchString: string) {
    let oMilestone: IMilestone = <IMilestone>{};
    oMilestone.forcedId = this.task.milestoneId ?? 0;
    oMilestone.linkedapptypeId = this.appTypeId;
    oMilestone.linkedtypeId = this.linkTypeId;

    if(searchString.length > 3) {
      oMilestone.name = searchString;  
    }

    this.milestoneService.findMilestone(oMilestone);
  }

  public onEnterSearch(type:string) {
    if(type=='contact') {
      this.contactService.saveFromSelect(this.contactSearch);
    }
    else if(type=='milestone') {
      let oMilestone = <IMilestone>{};
      oMilestone.name = this.milestoneSearch;
      oMilestone.linkedapptypeId = this.appTypeId;
      oMilestone.linkedtypeId = this.linkTypeId;
      this.milestoneService.saveFromSelect(oMilestone);
    }
  }

  public isPassedDeadline(oTask: ITask) {
    return (!oTask.completed) && new Date(oTask.deadline).getTime() < new Date().getTime();
  }

}
