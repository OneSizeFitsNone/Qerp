import { ChangeDetectorRef, Component } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IMilestone } from 'src/app/interfaces/milestone';
import { IProject } from 'src/app/interfaces/project';
import { IProspect } from 'src/app/interfaces/prospect';
import { ProjectService } from 'src/app/services/pm/project/project.service';
import { ProspectService } from 'src/app/services/pm/prospect/prospect.service';
import { MilestonesService } from 'src/app/services/tabs/milestones.service';
import { SaveditemService } from 'src/app/services/user/saveditems.service';
import { ISaveditem } from 'src/app/interfaces/saveditem';


@Component({
  selector: 'az-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.scss'],
  providers: [MilestonesService, ProjectService, ProspectService, AppTypes]
})

export class MilestoneComponent {
  public id: number = null;

  public milestone: IMilestone = <IMilestone>{};
  public apptypes: AppTypes = new AppTypes;

  public prospects: Array<IProspect> = [];
  public projects: Array<IProject> = [];
  public prospectSearch: string = "";
  public projectSearch: string = "";

  public milestoneForm: UntypedFormGroup;

  public tabIndex = 0;

  constructor(
    private milestonesService: MilestonesService,
    private projectService: ProjectService,
    private prospectService: ProspectService,
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
          this.milestonesService.createMilestone();       
      }
      else {
        this.milestonesService.getMilestone(this.id);
      }
    });

    this.milestoneForm = this.formBuilder.group({
      'linkedapptypeId': ['', Validators.required],
      'linkedtypeId': ['', Validators.required],
      'name': ['', Validators.required],
      'description': [''],
      'deadline': [''],
      'completed': ['']
    });


    this.milestonesService.milestone.subscribe(ms => {
      this.milestone = ms;
      this.milestone.linkedapptypeId == this.apptypes.prospect && this.milestone.linkedtypeId ? this.onSearchProspect("") : null;
      this.milestone.linkedapptypeId == this.apptypes.project && this.milestone.linkedtypeId ? this.onSearchProject("") : null;

      if(this.id == 0 && this.milestone.id > 0) {
        this.router.navigateByUrl("/pages/pm/milestone/"+this.milestone.id);
      }

      this.ref.detectChanges();
      this.milestoneForm.patchValue(this.milestone);
      this.ref.detectChanges();

    });

    this.prospectService.prospects.subscribe(p => {
      this.prospects = p;
    });

    this.projectService.projects.subscribe(p => {
      this.projects = p;
    })
  }

  onSubmit() {
    this.milestone = { ...this.milestone, ...this.milestoneForm.value}; 
    this.milestonesService.saveMilestone(this.milestone);
  }

  async undoChanges() {
    this.milestone.linkedapptypeId == this.apptypes.prospect ? this.onSearchProspect(null) : null;
    this.milestone.linkedapptypeId == this.apptypes.project ? this.onSearchProject(null) : null;
    this.ref.detectChanges();
    this.milestoneForm.patchValue(this.milestone);
    this.ref.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  public async saveItem(){
    let oSavedItem: ISaveditem = <ISaveditem>{};
    oSavedItem.id = 0;
    oSavedItem.name = this.milestone.name;
    oSavedItem.apptypeId = this.apptypes.milestone;
    oSavedItem.routelink = this.router.url;
    this.saveditemService.save(oSavedItem);
  }


  public onTypeChange() {
    this.milestoneForm.get("linkedtypeId").setValue(0);
    this.ref.detectChanges();
  }

  public onSearchProspect(searchString: string) {
    this.prospectSearch = searchString;
    let oProspect: IProspect = <IProspect>{};
    oProspect.forcedId = this.milestone.linkedtypeId;

    if(searchString.length > 2) {
      oProspect.number = searchString;
    }
    this.prospectService.findProspect(oProspect);    
  }

  public onSearchProject(searchString: string) {
    this.projectSearch = searchString;
    let oProject: IProject = <IProject>{};
    oProject.forcedId = this.milestone.linkedtypeId;

    if(searchString.length > 2) {
      oProject.number = searchString;
    }    
    this.projectService.findProject(oProject);
  }

  public onUpdateTasks(event: any){
    this.milestonesService.getMilestone(this.id);
  }

  public onTabIndexChange(i: any) {
    this.tabIndex=i;
  }


}
