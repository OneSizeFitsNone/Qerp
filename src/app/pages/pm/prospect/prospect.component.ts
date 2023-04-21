import { ChangeDetectorRef, Component } from '@angular/core';
import { Location } from '@angular/common';
import { ProspectService } from 'src/app/services/pm/prospect/prospect.service';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ParameterService } from 'src/app/services/settings/parameter.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IProspect } from 'src/app/interfaces/prospect';
import { IClient } from 'src/app/interfaces/client';
import { IContact } from 'src/app/interfaces/contact';
import { IParameter } from 'src/app/interfaces/parameter';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveditemService } from 'src/app/services/user/saveditems.service';
import { ISaveditem } from 'src/app/interfaces/saveditem';
import { ICity } from 'src/app/interfaces/city';

@Component({
  selector: 'az-prospect',
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.scss'],
  providers: [ProspectService, CompanyService, ContactService, ParameterService]
})

export class ProspectComponent {
  public id: number;

  public prospect: IProspect = <IProspect>{};

  public companies: Array<IClient> = [];
  public contacts: Array<IContact> = [];
  public prospectTypes: Array<IParameter> = [];
  public appTypes: AppTypes = new AppTypes();

  public prospectForm:UntypedFormGroup;

  public contactSearch: string = "";
  public companySearch: string = "";

  private st: number = null;
  private sl: number = null;

  constructor(
    private prospectService: ProspectService,
    private companyService: CompanyService,
    private contactService: ContactService,
    private parameterService: ParameterService,
    private formBuilder: UntypedFormBuilder,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    private saveditemService: SaveditemService,
    public router: Router
  ) {

  }

  async ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.st = params['st'];
      this.sl = params['sl'];
    });

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if(this.id == 0) {
          this.prospectService.createProspect(this.st, this.sl);       
      }
      else {
        this.prospectService.getProspect(this.id);
      }
    });

    this.prospectForm = this.formBuilder.group({
      'clientId': ['', Validators.required],
      'contactId': ['', Validators.required],
      'prospectTypeId': ['', Validators.required],
      'number': ['', numberValidator(this.id)],
      'description': [''],
      'deadline': [''],
      'estimatedBudget': [''] 
    });
    
    this.prospectService.prospect.subscribe(async c => {
      this.prospect = c;

      this.prospect.clientId ? this.companyService.findCompany(<IClient>{forcedId: this.prospect.clientId }) : null;
      this.prospect.contactId ? this.contactService.findContact(<IContact>{forcedId: this.prospect.contactId }) : null;

      if(this.id == 0 && this.prospect.id > 0) {
        this.router.navigateByUrl("/pages/pm/prospect/"+this.prospect.id);
      }

      this.ref.detectChanges();
      this.prospectForm.patchValue(this.prospect);
      this.ref.detectChanges();
    });
    
    this.companyService.companies.subscribe(c => {
      this.companies = c;
    });
    
    this.contactService.contacts.subscribe(c => {
      this.contacts = c;
    });

    this.prospectTypes = await this.parameterService.getByGroupSystemCode('prospecttypes');
  }

  onSubmit() {
    this.prospect = { ...this.prospect, ...this.prospectForm.value}; 
    this.prospectService.saveProspect(this.prospect);
  }

  async undoChanges() {
    this.companyService.findCompany(<IClient>{forcedId: this.prospect.clientId })
    this.contactService.findContact(<IContact>{forcedId: this.prospect.contactId })
    this.ref.detectChanges();
    this.prospectForm.patchValue(this.prospect);
    this.ref.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  public async saveItem(){
    let oSavedItem: ISaveditem = <ISaveditem>{};
    oSavedItem.id = 0;
    oSavedItem.name = this.prospect.number;
    oSavedItem.apptypeId = this.appTypes.prospect;
    oSavedItem.routelink = this.router.url;
    this.saveditemService.save(oSavedItem);
  }

  public onSearchCompany(searchString: string) {
    this.companySearch = searchString;
    let oCompany: IClient = <IClient>{};
    oCompany.city = <ICity>{};
    oCompany.forcedId = this.prospect.clientId ?? 0;

    if(searchString.length > 3) {
      oCompany.name = searchString;
    }

    this.companyService.findCompany(oCompany);
  }

  public onSearchContact(searchString: string) {
    this.contactSearch = searchString;
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{}
    oContact.forcedId = this.prospect.contactId ?? 0;

    if(searchString.length > 3) {
      oContact.fullname = searchString;  
    }

    this.contactService.findContact(oContact);
  }

  public onEnterSearchClientOrContact(type: string) {
    if(type == "contact") {
      this.contactService.saveFromSelect(this.contactSearch);
    }
    else if(type == "company") {
      this.companyService.saveFromSelect(this.companySearch);
    } 
  }

}

export function numberValidator(id) { 
  return id == 0 || id==null || id==undefined ? Validators.nullValidator : Validators.required;
}