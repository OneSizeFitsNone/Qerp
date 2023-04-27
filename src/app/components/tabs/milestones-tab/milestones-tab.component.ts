import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IMilestone } from 'src/app/interfaces/milestone';
import { MilestonesService } from 'src/app/services/tabs/milestones.service';


@Component({
  selector: 'az-milestones-tab',
  templateUrl: './milestones-tab.component.html',
  styleUrls: ['./milestones-tab.component.scss'],
  providers: [AppTypes, MilestonesService]
})

export class MilestonesTabComponent {
  @Input() appTypeId: number = null;
  @Input() linkTypeId: number = null;

  private milestones: Array<IMilestone> = [];
  public milestonesSearch: Array<IMilestone> = [];
  public milestone: IMilestone = <IMilestone>{};

  public ccSearch: string = "";

  public selectedId: number = -1;
  public hasNew: boolean = false;

  
  constructor(
    private appTypes: AppTypes,
    private ref: ChangeDetectorRef,
    private milestonesService: MilestonesService
  ) {    
  }
  
  ngOnInit() {

    this.milestonesService.milestones.subscribe(ms => {
      this.milestones = ms;
      this.onInputChange();
      this.ref.detectChanges();
      this.hasNew = this.milestones.find(cc => cc?.id == 0) ? true : false;
      this.ref.detectChanges();
    });

    this.milestonesService.milestone.subscribe(ms => {
      this.milestone = ms
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["appTypeId"] || changes["linkTypeId"]) {
      if(this.appTypeId && this.linkTypeId) {
        this.milestonesService.selectByApptype(this.appTypeId, this.linkTypeId);
      }
    }
  }

  public onInputChange() {
    this.milestonesSearch = this.milestones.filter(ms => ms.name.toLowerCase().includes(this.ccSearch.toLowerCase()));
  }

  public onCreateMilestone() {
    this.milestonesService.createMilestone(this.appTypeId, this.linkTypeId);
  }

  public editMilestone(oMilestone: IMilestone) {
    if(this.hasNew && this.milestone?.id == 0) {
      this.milestonesService.deleteMilestone(this.milestone);
    }
    this.milestonesService.getMilestone(oMilestone.id);
  }

  public saveMilestone(oMilestone: IMilestone) {
    if(oMilestone.name) {
      this.milestonesService.saveMilestone(oMilestone, true);
    }    
  }

  public deleteMilestone(oMilestone: IMilestone) {
    this.milestonesService.deleteMilestone(oMilestone);
  }

}
