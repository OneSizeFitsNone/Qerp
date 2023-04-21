import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { IAppTypeContact } from 'src/app/interfaces/apptypecontact';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { IContact } from 'src/app/interfaces/contact';
import { IContactrole } from 'src/app/interfaces/contactrole';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ContactroleService } from 'src/app/services/settings/contactrole.service';
import { ApptypecontactsService } from 'src/app/services/tabs/apptypecontacts.service';

@Component({
  selector: 'az-apptypecontacts',
  templateUrl: './apptypecontacts.component.html',
  styleUrls: ['./apptypecontacts.component.scss'],
  providers: [ApptypecontactsService, AppTypes, ContactroleService, ContactService, CompanyService]
})

export class ApptypecontactsComponent {
  @Input() appTypeId: number = null;
  @Input() linkTypeId: number = null;
  @Input() sourceAppTypeId: number = null;
  @Input() sourceLinkTypeId: number = null;

  public apptypecontacts: Array<IAppTypeContact> = [];
  public apptypecontactSearch: Array<IAppTypeContact> = [];
  public apptypecontact: IAppTypeContact = <IAppTypeContact>{};

  private contactroles: Array<IContactrole> = [];
  public contactroleSearch: Array<IContactrole> = [];

  public companies: Array<IClient> = [];
  public contacts: Array<IContact> = [];

  public ccSearch: string = "";
  
  public contactSearch: string = "";
  public companySearch: string = "";
  public roleSearch: string = "";

  public selectedId: number = -1;
  public hasNew: boolean = false;

  constructor(
    private apptypecontactService: ApptypecontactsService,
    private contactroleService: ContactroleService,
    private contactService: ContactService,
    private companyService: CompanyService,
    public appTypes: AppTypes,
    private ref: ChangeDetectorRef
  ) {    
  }

  ngOnInit() {
    this.apptypecontactService.apptypecontacts.subscribe(crs => {
      this.apptypecontacts = crs;
      this.onInputChange();
      
      this.ref.detectChanges();
      this.hasNew = this.apptypecontacts.find(cc => cc?.id == 0) ? true : false;
      this.ref.detectChanges();
    });
    
    this.contactroleService.contactroles.subscribe(cr => {
      this.contactroles = cr;
      this.contactroleSearch = this.contactroles.filter(c => c.name.toLowerCase().includes(this.roleSearch.toLowerCase()) || c.id == this.apptypecontact.contactroleId);
      this.ref.detectChanges();
    });

    this.apptypecontactService.apptypecontact.subscribe(cr => {
      this.apptypecontact = cr;
      if(this.apptypecontact.id) {
          this.onSearchCompany("");
          this.onSearchContact("");
      }
    });
        
    this.contactService.contacts.subscribe(c => { 
      this.contacts = c; 
      this.ref.detectChanges();
    });
    this.companyService.companies.subscribe(c => { 
      this.companies = c;
      this.ref.detectChanges();
    });

    //this.apptypecontactService.getByApptypeLinkedId(this.appTypeId, this.linkTypeId)
    this.contactroleService.getContactroles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["sourceAppTypeId"]  != null && changes["sourceLinkTypeId"] != null && changes["appTypeId"] != null) {
      this.apptypecontactService.getBySource(this.sourceAppTypeId, this.sourceLinkTypeId, this.appTypeId);
    }
    else if(changes["appTypeId"] != null || changes["linkTypeId"] != null) {
      this.apptypecontactService.getByApptypeLinkedId(this.appTypeId, this.linkTypeId);
    }
  }

  public onInputChange() {
    this.apptypecontactSearch = this.apptypecontacts.filter(
      cr => this.ccSearch == "" || cr.id == 0 || 
        cr.contact?.fullname?.toLowerCase().startsWith(this.ccSearch.toLowerCase()) ||
        cr.client?.name?.toLowerCase().startsWith(this.ccSearch.toLowerCase()) ||
        cr.prospect?.number.toLowerCase().startsWith(this.ccSearch.toLowerCase())
    );
  }

  public onCreateApptypecontact() {
    this.apptypecontactService.createApptypecontact(this.appTypeId, this.linkTypeId);
  }

  public saveApptypecontact(oApptypecontact: IAppTypeContact) {
    if(oApptypecontact.contactroleId > 0 && oApptypecontact.clientId > 0 && oApptypecontact.contactId > 0) {
      this.apptypecontactService.saveApptypecontact(oApptypecontact);
    } 
  }

  public deleteApptypecontact(oApptypecontact: IAppTypeContact) {
    this.apptypecontactService.deleteApptypecontact(oApptypecontact);
  }

  public editApptypecontact(oApptypecontact) {
    if(this.hasNew && this.apptypecontact?.id == 0) {
      this.apptypecontactService.deleteApptypecontact(this.apptypecontact);
    }
    this.apptypecontactService.getApptypecontact(oApptypecontact.id);
  }

  public onSearchCompany(searchString: string) {
    let oCompany: IClient = <IClient>{};
    oCompany.city = <ICity>{};
    oCompany.forcedId = this.apptypecontact.clientId ?? 0;

    if(searchString.length > 3) {
      oCompany.name = searchString;
    }

    this.companyService.findCompany(oCompany);
  }

  public onSearchContact(searchString: string) {
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{}
    oContact.forcedId = this.apptypecontact.contactId ?? 0;

    if(searchString.length > 3) {
      oContact.fullname = searchString;  
    }

    this.contactService.findContact(oContact);
  }

  public onEnterSearch(type:string) {
    if(type=='contact') {
      this.contactService.saveFromSelect(this.contactSearch);
    }
    else if(type=='company') {
      this.companyService.saveFromSelect(this.companySearch);
    }
  }

  public onSearchRole(searchString: string) {
    this.contactroleSearch = this.contactroles.filter(c => c.name.toLowerCase().includes(searchString.toLowerCase()) || c.id == this.apptypecontact.contactroleId);
  }

  public onEnterSearchContactrole() {
    let oContactrole: IContactrole = <IContactrole>{};
    oContactrole.id = 0;
    oContactrole.name = this.roleSearch;
    this.contactroleService.saveRole(oContactrole);
  }
  
}
