import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { IClientcontact } from 'src/app/interfaces/clientcontact';
import { IContact } from 'src/app/interfaces/contact';
import { IContactrole } from 'src/app/interfaces/contactrole';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { ContactroleService } from 'src/app/services/settings/contactrole.service';
import { ClientcontactsService } from 'src/app/services/tabs/clientcontacts.service';

@Component({
  selector: 'az-clientcontacts-tab',
  templateUrl: './clientcontacts-tab.component.html',
  styleUrls: ['./clientcontacts-tab.component.scss'],
  providers: [ClientcontactsService, AppTypes, ContactroleService, ContactService, CompanyService]
})

export class ClientcontactsTabComponent {
  @Input() appTypeId: number = null;
  @Input() linkTypeId: number = null; 
  


  public clientContacts: Array<IClientcontact> = [];
  public clientContactsSearch: Array<IClientcontact> = [];
  public clientContact: IClientcontact = <IClientcontact>{};

  public contactroles: Array<IContactrole> = [];
  public companies: Array<IClient> = [];
  public contacts: Array<IContact> = [];  

  public ccSearch: string = "";
  public contactSearch: string = "";
  public companySearch: string = "";

  public selectedId: number = -1;

  constructor(
    private clientcontactService: ClientcontactsService,
    private contactroleService: ContactroleService,
    private contactService: ContactService,
    private companyService: CompanyService,
    private appTypes: AppTypes,
    private ref: ChangeDetectorRef
  ) {    
  }

  ngOnInit() {
    this.clientcontactService.clientcontacts.subscribe(crs => {
      this.clientContacts = crs

      this.clientContactsSearch = this.clientContacts.filter(
        cr => this.ccSearch == "" || cr.id == 0 || 
          (this.appTypeId == this.appTypes.client && cr.contact.fullname.startsWith(this.ccSearch)) ||
          (this.appTypeId == this.appTypes.contact && cr.client.name.startsWith(this.ccSearch))
      );
      this.ref.detectChanges();
    });
    
    this.contactroleService.contactroles.subscribe(cr => {
      this.contactroles = cr
    });

    this.clientcontactService.clientcontact.subscribe(cr => {
      this.clientContact = cr;
      if(this.clientContact.id) {
        if(this.appTypeId == this.appTypes.contact) {
          this.onSearchCompany("");
        }      
        else {
          this.onSearchContact("");
        }
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

    this.contactroleService.getContactroles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["appTypeId"] || changes["linkTypeId"]) {
      if(this.appTypeId && this.linkTypeId) {
        if(this.appTypeId == this.appTypes.contact) {
          this.clientcontactService.getByContact(this.linkTypeId);
        }
        else if(this.appTypeId == this.appTypes.client) {
          this.clientcontactService.getByCompany(this.linkTypeId);
        }
      }
    }
  }

  public onInputChange() {
    this.clientContactsSearch = this.clientContacts.filter(
      cr => this.ccSearch == "" || cr.id == 0 || 
        (this.appTypeId == this.appTypes.client && cr.contact.fullname.toLowerCase().startsWith(this.ccSearch.toLowerCase())) ||
        (this.appTypeId == this.appTypes.contact && cr.client.name.toLowerCase().startsWith(this.ccSearch.toLowerCase()))
    );
  }

  public onCreateClientcontact() {
    this.clientcontactService.createClientcontact(this.appTypeId, this.linkTypeId);
  }

  public editClientcontact(oClientcontact) {   
    this.clientcontactService.getClientcontact(oClientcontact.id);
  }

  public saveClientcontact(oClientcontact: IClientcontact) {
    if(oClientcontact.contactroleId > 0 && (
        (this.appTypeId == this.appTypes.client && oClientcontact.contactId > 0) ||
        (this.appTypeId == this.appTypes.contact && oClientcontact.clientId > 0)
      ) 
    ) {
      this.clientcontactService.saveClientcontact(oClientcontact, this.appTypeId);
    }
    
  }

  public deleteContactrole(oClientcontact: IClientcontact) {
    this.clientcontactService.deleteClientcontact(oClientcontact);
  }

  public onSearchCompany(searchString: string) {
    let oCompany: IClient = <IClient>{};
    oCompany.city = <ICity>{};
    oCompany.forcedId = this.clientContact.clientId ?? 0;

    if(searchString.length > 3) {
      oCompany.name = searchString;
    }

    this.companyService.findCompany(oCompany);
  }

  public onSearchContact(searchString: string) {
    let oContact: IContact = <IContact>{};
    oContact.city = <ICity>{}
    oContact.forcedId = this.clientContact.contactId ?? 0;

    if(searchString.length > 3) {
      oContact.fullname = searchString;  
    }

    this.contactService.findContact(oContact);
  }

  public onEnterSearchClientOrContact() {
    if(this.appTypeId == this.appTypes.client) {
      this.contactService.saveFromSelect(this.contactSearch);
    }
    else if(this.appTypeId == this.appTypes.contact) {
      this.companyService.saveFromSelect(this.companySearch);
    }
  }

}
