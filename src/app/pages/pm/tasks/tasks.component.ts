import { ChangeDetectorRef, Component } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IContact } from 'src/app/interfaces/contact';
import { IMilestone } from 'src/app/interfaces/milestone';
import { IProject } from 'src/app/interfaces/project';
import { IProspect } from 'src/app/interfaces/prospect';
import { ITask } from 'src/app/interfaces/task';
import { IUser } from 'src/app/interfaces/user';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ProjectService } from 'src/app/services/pm/project/project.service';
import { ProspectService } from 'src/app/services/pm/prospect/prospect.service';
import { TaskService } from 'src/app/services/pm/task/task.service';
import { MilestonesService } from 'src/app/services/tabs/milestones.service';
import { SearchhistoryService } from 'src/app/services/user/searchhistory.service';

@Component({
  selector: 'az-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [TaskService, MilestonesService, ProjectService, ProspectService, ContactService, AppTypes]
})

export class TasksComponent {
  public tasks: Array<ITask> = [];
  public task: ITask = <ITask>{};

  public advancedSearch: boolean = false;
  public apptypes: AppTypes = new AppTypes;

  public prospects: Array<IProspect> = [];
  public projects: Array<IProject> = [];
  public milestones: Array<IMilestone> = [];
  public contacts: Array<IContact> = [];
  public prospectSearch: string = "";
  public projectSearch: string = "";
  public milestoneSearch: string = "";
  public contactSearch: string = "";

  public apptype: number = null;

  public dateNow = new Date();

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private prospectService: ProspectService,
    private milestoneService: MilestonesService,
    private contactService: ContactService,
    private ref: ChangeDetectorRef,
    private searchHistory: SearchhistoryService,
  ){

  }

  async ngOnInit() {
    
    this.taskService.tasks.subscribe(ms => {
      this.tasks = ms;
    });

    this.prospectService.prospects.subscribe(p => {
      this.prospects = p;
    });

    this.projectService.projects.subscribe(p => {
      this.projects = p;
    })

    this.milestoneService.milestones.subscribe(p => {
      this.milestones = p;
    })

    this.contactService.contacts.subscribe(p => {
      this.contacts = p;
    })

    let oHistory = this.searchHistory.getHistory(this.apptypes.task);
    if(oHistory) {
      this.task = <ITask>oHistory;
      this.onSearch();
    }
    else {
      this.task = <ITask>{};
      this.task.contactId = (<IUser>JSON.parse(localStorage.getItem("currentuser"))).contactId;
      this.task.completed = false;
      let date = new Date(new Date().setDate(new Date().getDate() - 1));
      this.task.deadlineFrom = date;
      date = new Date(new Date().setDate(new Date().getDate() + 7));
      this.task.deadlineTo = date;
    }
    this.onSearchContact("");
  }

  onSearch() {
    this.taskService.findTask(this.task);
    this.searchHistory.addHistory(this.apptypes.task, this.task);
  }

  onInputChange(item: string) {
    let object = item.includes(".") ? this.task[item.split(".")[0]][item.split(".")[1]] : this.task[item]
    let search: boolean = false;
    let hasOtherKeys: boolean = false;

    for(let key of Object.keys(this.task)) {
      if(key != item && this.task[key] != null && this.task[key].length > 0) {
        hasOtherKeys = true;
      }
    }

    if((hasOtherKeys && (object?.length > 0 || Number(object) > 0)) || (!hasOtherKeys && (object?.length > 2 || Number(object) > 0)) ) {
      search = true;
    }
    else if(!hasOtherKeys && object?.length == 0) {
      this.tasks = []
    }

    if(search) {
      this.taskService.findTask(this.task);
      this.searchHistory.addHistory(this.apptypes.task, this.task);
    }
  }

  public onSearchProspect(searchString: string) {
    let oProspect: IProspect = <IProspect>{};
    oProspect.forcedId = 0;

    if(searchString.length > 2) {
      oProspect.number = searchString;
    }

    this.prospectService.findProspect(oProspect);
  }

  public onSearchProject(searchString: string) {
    let oProject: IProject = <IProject>{};
    oProject.forcedId = 0;

    if(searchString.length > 2) {
      oProject.number = searchString;
    }

    this.projectService.findProject(oProject);
  }

  public onSearchMilestone(searchString: string) {
    let oMilestone: IMilestone = <IMilestone>{};
    oMilestone.forcedId = 0;

    if(searchString.length > 2) {
      oMilestone.name = searchString;
    }

    this.milestoneService.findMilestone(oMilestone);
  }

  public onSearchContact(searchString: string) {
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{};
    oContact.forcedId = this.task.contactId;

    if(searchString.length > 2) {
      oContact.fullname = searchString;
    }

    this.contactService.findUser(oContact);
  }

  public onTypeChange() {
    this.task.projectId = null;
    this.task.prospectId = null;
    this.task.milestoneId = null;
  }

  public getDateClass(oTask: ITask) {
    return oTask.completed == false && new Date(oTask.deadline) < new Date() ? 'text-danger' : '';
  }

}
