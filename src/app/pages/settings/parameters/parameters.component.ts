import { ChangeDetectorRef, Component } from '@angular/core';
import { IParameter } from 'src/app/interfaces/parameter';
import { IParametergroup } from 'src/app/interfaces/parametergroup';
import { ParameterService } from 'src/app/services/settings/parameter.service';

@Component({
  selector: 'az-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  providers: [ParameterService]
})


export class ParametersComponent {
  private parametergroups: Array<IParametergroup> = [];
  public groupResults: Array<IParametergroup> = [];
  private parameters: Array<IParameter> = [];
  public parameterResults: Array<IParameter> = [];
  public parameter: IParameter = <IParameter>{};

  public srchGroup: string = "";
  public srchParameter: string = "";

  public selectedGroup: IParametergroup = <IParametergroup>{};

  public hasNew: boolean = false;

  constructor(
    private parameterService: ParameterService,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.parameterService.groups.subscribe(g => {
      this.parametergroups = g;
      this.onGroupSearch();
    });

    this.parameterService.parameters.subscribe(pms => {
      this.parameters = pms;
      this.ref.detectChanges();
      this.hasNew = this.parameters.find(p => p.id == 0) ? true : false;
      this.ref.detectChanges();
      this.onParameterSearch();
      
    });

    this.parameterService.parameter.subscribe(p => {
      this.parameter = p;
    });

    this.parameterService.loadGroups();
  } 

  public onGroupSearch() {
    this.groupResults = this.parametergroups.filter(gr => gr.name.toLowerCase().includes(this.srchGroup.toLowerCase()));
    this.ref.detectChanges();
  }

  public onParameterSearch() {
    this.parameterResults = this.parameters.filter(pm => pm.name?.toLowerCase().includes(this.srchParameter.toLowerCase()) || pm.id == 0);
    this.parameterResults.sort((a,b) => { return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0 });
    this.ref.detectChanges();
  }

  public onCreateParameter() {
    this.parameterService.createParameter(this.selectedGroup.id);
  }

  public onEditParameter(oParameter: IParameter) {
    if(this.parameter.id == 0) {
      this.parameterService.delete(this.parameter)
    }
    this.parameterService.getById(oParameter.id);
  }

  public onSaveParameter(oParameter: IParameter) {
    if(oParameter.name?.length > 0) {
      this.parameterService.save(oParameter);
    }    
  }

  public onDeleteParameter(oParameter: IParameter) {
    this.parameterService.delete(oParameter);
  }

  public onGroupSelect(oGroup: IParametergroup) {
    this.parameter = <IParameter>{};
    this.selectedGroup = oGroup;
    this.parameterService.getByGroupId(oGroup.id);
  }
  
}
