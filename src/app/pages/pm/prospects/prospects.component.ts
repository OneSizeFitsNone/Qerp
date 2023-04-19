import { ChangeDetectorRef, Component } from '@angular/core';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { IContact } from 'src/app/interfaces/contact';
import { IParameter } from 'src/app/interfaces/parameter';
import { IProspect } from 'src/app/interfaces/prospect';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ProspectService } from 'src/app/services/pm/prospect/prospect.service';
import { ParameterService } from 'src/app/services/settings/parameter.service';

@Component({
  selector: 'az-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.scss'],
  providers: [ProspectService, ContactService, CompanyService, ParameterService]
})

export class ProspectsComponent {
  public prospects: Array<IProspect> = [];
  public prospect: IProspect = <IProspect>{};

  public companies: Array<IClient> = [];
  public contacts: Array<IContact> = [];
  public prospectTypes: Array<IParameter> = [];

  public contactSearch: string = "";
  public companySearch: string = "";

  public advancedSearch: boolean = false;

  constructor(
    private prospectService: ProspectService,
    private contactService: ContactService,
    private companyService: CompanyService,
    private parameterService: ParameterService,
    private ref: ChangeDetectorRef
  ){

  }

  async ngOnInit() {
    this.prospectService.prospects.subscribe(p => {
      this.prospects = p;
    });
    this.contactService.contacts.subscribe(c => {
      this.contacts = c;
    });
    this.companyService.companies.subscribe(c => {
      this.companies = c;
    });
    this.prospectTypes = await this.parameterService.getByGroupSystemCode("prospecttypes")
  }

  onSearch() {
    this.prospectService.findProspect(this.prospect);
  }

  onInputChange(item: string) {
    let object = item.includes(".") ? this.prospect[item.split(".")[0]][item.split(".")[1]] : this.prospect[item]
    let search: boolean = false;
    let hasOtherKeys: boolean = false;

    for(let key of Object.keys(this.prospect)) {
      if(key != item && this.prospect[key] != null && this.prospect[key].length > 0) {
        hasOtherKeys = true;
      }
    }

    if((hasOtherKeys && (object?.length > 0 || Number(object) > 0)) || (!hasOtherKeys && (object?.length > 2 || Number(object) > 0)) ) {
      search = true;
    }
    else if(!hasOtherKeys && object?.length == 0) {
      this.prospects = []
    }

    if(search) {
      this.prospectService.findProspect(this.prospect);
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
