import { ChangeDetectorRef, Component } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ITask } from 'src/app/interfaces/task';
import { IProject } from 'src/app/interfaces/project';
import { IProspect } from 'src/app/interfaces/prospect';
import { ISaveditem } from 'src/app/interfaces/saveditem';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ProjectService } from 'src/app/services/pm/project/project.service';
import { ProspectService } from 'src/app/services/pm/prospect/prospect.service';
import { TaskService } from 'src/app/services/pm/task/task.service';
import { SaveditemService } from 'src/app/services/user/saveditems.service';
import { MilestonesService } from 'src/app/services/tabs/milestones.service';
import { IMilestone } from 'src/app/interfaces/milestone';
import { IContact } from 'src/app/interfaces/contact';
import { ICity } from 'src/app/interfaces/city';
import { IUser } from 'src/app/interfaces/user';

@Component({
  selector: 'az-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  providers: [TaskService, MilestonesService, ProjectService, ProspectService, ContactService, AppTypes]
})

export class TaskComponent {
  public id: number = null;

  public task: ITask = <ITask>{};
  public apptypes: AppTypes = new AppTypes;

  public prospects: Array<IProspect> = [];
  public projects: Array<IProject> = [];
  public milestones: Array<IMilestone> = [];
  public contacts: Array<IContact> = [];
  public prospectSearch: string = "";
  public projectSearch: string = "";
  public milestoneSearch: string = "";
  public contactSearch: string = "";

  public taskForm: UntypedFormGroup;
  
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private prospectService: ProspectService,
    private milestoneService: MilestonesService,
    private contactService: ContactService,
    private formBuilder: UntypedFormBuilder,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    private saveditemService: SaveditemService,
    public router: Router
  ){

  }


  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if(this.id == 0) {
          this.taskService.createTask();       
      }
      else {
        this.taskService.getTask(this.id);
      }
    });

    this.taskForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'completed': [''],

      'sourceId': ['', Validators.required],
      'prospectId': [''],//, sourceValidator(this.taskForm.controls['sourceId'].value, this.apptypes.prospect)],
      'projectId': [''],//, sourceValidator(this.taskForm.controls['sourceId'].value, this.apptypes.project)],    

      'milestoneId': [''],
      'contactId': ['', Validators.required],
      
      'deadline': [''],
      'toInvoice': [''],

      'description': ['']
    });


    this.taskService.task.subscribe(ms => {
      if(ms.id) {
        this.task = ms;
        this.task.sourceId = this.task.projectId > 0 ? this.apptypes.project : this.task.prospectId > 0 ? this.apptypes.prospect : null;
  
        if(this.id == 0 && this.task.id > 0) {
          this.router.navigateByUrl("/pages/pm/task/"+this.task.id);
        }
  
        this.ref.detectChanges();
        this.taskForm.patchValue(this.task);
        this.ref.detectChanges();
  
        if(this.task.prospectId > 0) this.onSearchProspect("");
        if(this.task.projectId > 0) this.onSearchProject("");
        if(this.task.milestoneId > 0) this.onSearchMilestone("");
        this.onSearchContact("");
      }
    });

    this.prospectService.prospects.subscribe(p => {
      this.prospects = p;
    });

    this.projectService.projects.subscribe(p => {
      this.projects = p;
    })

    this.milestoneService.milestones.subscribe(m => {
      this.milestones = m;
    });

    this.contactService.contacts.subscribe(c => {
      this.contacts = c;
    });

  }

  onSubmit() {
    this.task = { ...this.task, ...this.taskForm.value}; 
    this.taskService.saveTask(this.task);
  }

  async undoChanges() {
    this.ref.detectChanges();
    this.taskForm.patchValue(this.task);
    this.ref.detectChanges();

    if(this.task.prospectId > 0) this.onSearchProspect("");
    if(this.task.projectId > 0) this.onSearchProject("");
    if(this.task.milestoneId > 0) this.onSearchMilestone("");
    this.onSearchContact("");
  }

  goBack() {
    this.location.back();
  }

  public async saveItem(){
    let oSavedItem: ISaveditem = <ISaveditem>{};
    oSavedItem.id = 0;
    oSavedItem.name = this.task.title;
    oSavedItem.apptypeId = this.apptypes.task;
    oSavedItem.routelink = this.router.url;
    this.saveditemService.save(oSavedItem);
  }


  public onSourceChange() {
    this.taskForm.get("prospectId").setValue(0);
    this.taskForm.get("projectId").setValue(0);
    this.taskForm.get("milestoneId").setValue(0);
    this.milestones = [];
    this.prospects = [];
    this.projects = [];
    this.ref.detectChanges();
  }

  public onProspectProjectChange() {
    this.taskForm.get("milestoneId").setValue(0);
    this.milestones = [];
  }

  public onSearchProspect(searchString: string) {
    this.prospectSearch = searchString;
    let oProspect: IProspect = <IProspect>{};
    oProspect.forcedId = this.taskForm.controls['prospectId'].value;

    if(searchString.length > 2) {
      oProspect.number = searchString;
    }
    this.prospectService.findProspect(oProspect);    
  }

  public onSearchProject(searchString: string) {
    this.projectSearch = searchString;
    let oProject: IProject = <IProject>{};
    oProject.forcedId = this.taskForm.controls['projectId'].value;

    if(searchString.length > 2) {
      oProject.number = searchString;
    }    
    this.projectService.findProject(oProject);
  }

  public onSearchMilestone(searchString: string) {
    this.milestoneSearch = searchString;
    let oMilestone: IMilestone = <IMilestone>{};
    oMilestone.forcedId = this.taskForm.controls['milestoneId'].value;
    oMilestone.linkedapptypeId = this.taskForm.controls['sourceId'].value;
    oMilestone.linkedtypeId = this.taskForm.controls['sourceId'].value == this.apptypes.prospect ? this.taskForm.controls['prospectId'].value : this.taskForm.controls['projectId'].value;

    if(searchString.length > 2) {
      oMilestone.name = searchString;
    }    
    this.milestoneService.findMilestone(oMilestone);
  }

  public onSearchContact(searchString: string) {
    this.contactSearch = searchString;
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{};

    oContact.forcedId = this.id == 0 ? (<IUser>JSON.parse(localStorage.getItem("currentuser"))).contactId : this.taskForm.controls['contactId'].value;

    if(searchString.length > 2) {
      oContact.fullname = searchString;
    }    
    this.contactService.findUser(oContact);
  }


}

export function sourceValidator(sourceId: number, apptype: number) { 
  return apptype == sourceId ? Validators.required : Validators.nullValidator;
}

