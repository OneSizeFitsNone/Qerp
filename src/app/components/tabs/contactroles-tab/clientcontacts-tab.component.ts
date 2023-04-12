import { Component, Input, SimpleChanges } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { IClientcontact } from 'src/app/interfaces/clientcontact';
import { IContactrole } from 'src/app/interfaces/contactrole';
import { ContactroleService } from 'src/app/services/settings/contactrole.service';
import { ClientcontactsService } from 'src/app/services/tabs/clientcontacts.service';

@Component({
  selector: 'az-clientcontacts-tab',
  templateUrl: './clientcontacts-tab.component.html',
  styleUrls: ['./clientcontacts-tab.component.scss'],
  providers: [ClientcontactsService, AppTypes, ContactroleService]
})

export class ClientcontactsTabComponent {
  @Input() appTypeId: number = null;
  @Input() linkTypeId: number = null; 
  


  public clientContacts: Array<IClientcontact> = [];
  public clientContactsSearch: Array<IClientcontact> = [];
  public clientContact: IClientcontact = <IClientcontact>{};

  public contactroles: Array<IContactrole> = [];

  public ccSearch: string = "";

  constructor(
    private clientcontactService: ClientcontactsService,
    private contactroleService: ContactroleService,
    private appTypes: AppTypes,
  ) { 
    this.clientcontactService.clientcontacts.subscribe(crs => {
      this.clientContacts = crs

      this.clientContactsSearch = this.clientContacts.filter(
        cr => this.ccSearch == "" || cr.id == 0 || 
          (this.appTypeId == this.appTypes.client && cr.contact.fullname.startsWith(this.ccSearch)) ||
          (this.appTypeId == this.appTypes.contact && cr.client.name.startsWith(this.ccSearch))
      );

    });
    this.clientcontactService.clientcontact.subscribe(cr => {
      this.clientContact = cr; 
    });
    this.contactroleService.contactroles.subscribe(cr => {
      this.contactroles = cr
    });
  }

  ngOnInit() {
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
    this.clientcontactService.createClientcontact();
  }

  public editClientcontact(oClientcontact) {
    this.clientcontactService.getClientcontact(oClientcontact.id);
  }

  public saveClientcontact(oClientcontact: IClientcontact) {
    this.clientcontactService.saveClientcontact(oClientcontact, this.appTypeId);
  }

  public deleteContactrole(oClientcontact: IClientcontact) {
    this.clientcontactService.deleteClientcontact(oClientcontact);
  }

}
