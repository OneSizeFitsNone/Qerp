import { ChangeDetectorRef, Component } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IMilestone } from 'src/app/interfaces/milestone';
import { IProject } from 'src/app/interfaces/project';
import { IProspect } from 'src/app/interfaces/prospect';
import { ProjectService } from 'src/app/services/pm/project/project.service';
import { ProspectService } from 'src/app/services/pm/prospect/prospect.service';
import { MilestonesService } from 'src/app/services/tabs/milestones.service';
import { SearchhistoryService } from 'src/app/services/user/searchhistory.service';

@Component({
  selector: 'az-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss'],
  providers: [MilestonesService, ProjectService, ProspectService, AppTypes]
})

export class MilestonesComponent {
  public milestones: Array<IMilestone> = [];
  public milestone: IMilestone = <IMilestone>{};

  public advancedSearch: boolean = false;
  public apptypes: AppTypes = new AppTypes;

  public prospects: Array<IProspect> = [];
  public projects: Array<IProject> = [];
  public prospectSearch: string = "";
  public projectSearch: string = "";

  constructor(
    private milestonesService: MilestonesService,
    private projectService: ProjectService,
    private prospectService: ProspectService,
    private ref: ChangeDetectorRef,
    private searchHistory: SearchhistoryService,
  ){

  }

  async ngOnInit() {
    this.milestonesService.milestones.subscribe(ms => {
      this.milestones = ms;
    });

    this.prospectService.prospects.subscribe(p => {
      this.prospects = p;
    });

    this.projectService.projects.subscribe(p => {
      this.projects = p;
    })

    let oHistory = this.searchHistory.getHistory(this.apptypes.milestone);
    if(oHistory) {
      this.milestone = <IMilestone>oHistory;
      this.onSearch();
    }
  }

  onSearch() {
    this.milestonesService.findMilestone(this.milestone);
    this.searchHistory.addHistory(this.apptypes.milestone, this.milestone);
  }

  onInputChange(item: string) {
    let object = item.includes(".") ? this.milestone[item.split(".")[0]][item.split(".")[1]] : this.milestone[item]
    let search: boolean = false;
    let hasOtherKeys: boolean = false;

    for(let key of Object.keys(this.milestone)) {
      if(key != item && this.milestone[key] != null && this.milestone[key].length > 0) {
        hasOtherKeys = true;
      }
    }

    if((hasOtherKeys && (object?.length > 0 || Number(object) > 0)) || (!hasOtherKeys && (object?.length > 2 || Number(object) > 0)) ) {
      search = true;
    }
    else if(!hasOtherKeys && object?.length == 0) {
      this.milestones = []
    }

    if(search) {
      this.milestonesService.findMilestone(this.milestone);
      this.searchHistory.addHistory(this.apptypes.milestone, this.milestone);
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
  

}
