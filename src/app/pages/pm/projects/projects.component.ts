import { ChangeDetectorRef, Component } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { IContact } from 'src/app/interfaces/contact';
import { IParameter } from 'src/app/interfaces/parameter';
import { IProject } from 'src/app/interfaces/project';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ProjectService } from 'src/app/services/pm/project/project.service';
import { ParameterService } from 'src/app/services/settings/parameter.service';
import { SearchhistoryService } from 'src/app/services/user/searchhistory.service';

@Component({
  selector: 'az-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [ProjectService, ContactService, CompanyService, ParameterService]
})

export class ProjectsComponent {
  public projects: Array<IProject> = [];
  public project: IProject = <IProject>{};

  public companies: Array<IClient> = [];
  public contacts: Array<IContact> = [];
  public projectTypes: Array<IParameter> = [];
  public statuses: Array<IParameter> = [];

  public contactSearch: string = "";
  public companySearch: string = "";

  public advancedSearch: boolean = false;

  public apptypes: AppTypes = new AppTypes;
  
  constructor(
    private projectService: ProjectService,
    private contactService: ContactService,
    private companyService: CompanyService,
    private parameterService: ParameterService,
    private ref: ChangeDetectorRef,
    private searchHistory: SearchhistoryService,
  ){

  }

  async ngOnInit() {
    this.projectService.projects.subscribe(p => {
      this.projects = p;
    });
    this.contactService.contacts.subscribe(c => {
      this.contacts = c;
    });
    this.companyService.companies.subscribe(c => {
      this.companies = c;
    });
    this.projectTypes = await this.parameterService.getByGroupSystemCode("projecttypes");
    this.statuses = await this.parameterService.getByGroupSystemCode("projectstatuses");
    let oHistory = this.searchHistory.getHistory(this.apptypes.project);
    if(oHistory) {
      this.project = <IProject>oHistory;
      this.onSearch();
    }
  }

  onSearch() {
    this.projectService.findProject(this.project);
    this.searchHistory.addHistory(this.apptypes.project, this.project);
  }

  onInputChange(item: string) {
    let object = item.includes(".") ? this.project[item.split(".")[0]][item.split(".")[1]] : this.project[item]
    let search: boolean = false;
    let hasOtherKeys: boolean = false;

    for(let key of Object.keys(this.project)) {
      if(key != item && this.project[key] != null && this.project[key].length > 0) {
        hasOtherKeys = true;
      }
    }

    if((hasOtherKeys && (object?.length > 0 || Number(object) > 0)) || (!hasOtherKeys && (object?.length > 2 || Number(object) > 0)) ) {
      search = true;
    }
    else if(!hasOtherKeys && object?.length == 0) {
      this.projects = []
    }

    if(search) {
      this.projectService.findProject(this.project);
      this.searchHistory.addHistory(this.apptypes.project, this.project);
    }
  }

  public onSearchCompany(searchString: string) {
    let oCompany: IClient = <IClient>{};
    oCompany.city = <ICity>{};
    oCompany.forcedId = 0;

    if(searchString.length > 2) {
      oCompany.name = searchString;
    }

    this.companyService.findCompany(oCompany);
  }

  public onSearchContact(searchString: string) {
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{};
    oContact.forcedId = 0;
    
    if(searchString.length > 3) {
      oContact.fullname = searchString;  
    }

    this.contactService.findContact(oContact);
  }
  

}
