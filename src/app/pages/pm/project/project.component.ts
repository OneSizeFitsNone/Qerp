import { ChangeDetectorRef, Component } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectService } from 'src/app/services/pm/project/project.service';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ParameterService } from 'src/app/services/settings/parameter.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IProject } from 'src/app/interfaces/project';
import { IClient } from 'src/app/interfaces/client';
import { IContact } from 'src/app/interfaces/contact';
import { IParameter } from 'src/app/interfaces/parameter';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveditemService } from 'src/app/services/user/saveditems.service';
import { ISaveditem } from 'src/app/interfaces/saveditem';
import { ICity } from 'src/app/interfaces/city';

@Component({
  selector: 'az-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [ProjectService, CompanyService, ContactService, ParameterService]
})

export class ProjectComponent {
  public id: number;

  public project: IProject = <IProject>{};

  public companies: Array<IClient> = [];
  public contacts: Array<IContact> = [];
  public projectTypes: Array<IParameter> = [];
  public appTypes: AppTypes = new AppTypes();

  public projectForm:UntypedFormGroup;

  public contactSearch: string = "";
  public companySearch: string = "";

  private st: number = null;
  private sl: number = null;

  constructor(
    private projectService: ProjectService,
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
          this.projectService.createProject(this.st, this.sl);       
      }
      else {
        this.projectService.getProject(this.id);
      }
    });

    this.projectForm = this.formBuilder.group({
      'clientId': ['', Validators.required],
      'contactId': ['', Validators.required],
      'projectTypeId': ['', Validators.required],
      'number': ['', numberValidator(this.id)],
      'description': [''],
      'deadline': [''],
      'estimatedBudget': [''] 
    });
    
    this.projectService.project.subscribe(async c => {
      this.project = c;

      this.project.clientId ? this.companyService.findCompany(<IClient>{forcedId: this.project.clientId }) : null;
      this.project.contactId ? this.contactService.findContact(<IContact>{forcedId: this.project.contactId }) : null;

      if(this.id == 0 && this.project.id > 0) {
        this.router.navigateByUrl("/pages/pm/project/"+this.project.id);
      }

      this.ref.detectChanges();
      this.projectForm.patchValue(this.project);
      this.ref.detectChanges();
    });
    
    this.companyService.companies.subscribe(c => {
      this.companies = c;
    });
    
    this.contactService.contacts.subscribe(c => {
      this.contacts = c;
    });

    this.projectTypes = await this.parameterService.getByGroupSystemCode('projecttypes');
  }

  onSubmit() {
    this.project = { ...this.project, ...this.projectForm.value}; 
    this.projectService.saveProject(this.project);
  }

  async undoChanges() {
    this.companyService.findCompany(<IClient>{forcedId: this.project.clientId })
    this.contactService.findContact(<IContact>{forcedId: this.project.contactId })
    this.ref.detectChanges();
    this.projectForm.patchValue(this.project);
    this.ref.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  public async saveItem(){
    let oSavedItem: ISaveditem = <ISaveditem>{};
    oSavedItem.id = 0;
    oSavedItem.name = this.project.number;
    oSavedItem.apptypeId = this.appTypes.project;
    oSavedItem.routelink = this.router.url;
    this.saveditemService.save(oSavedItem);
  }

  public onSearchCompany(searchString: string) {
    this.companySearch = searchString;
    let oCompany: IClient = <IClient>{};
    oCompany.city = <ICity>{};
    oCompany.forcedId = this.project.clientId ?? 0;

    if(searchString.length > 3) {
      oCompany.name = searchString;
    }

    this.companyService.findCompany(oCompany);
  }

  public onSearchContact(searchString: string) {
    this.contactSearch = searchString;
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{}
    oContact.forcedId = this.project.contactId ?? 0;

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