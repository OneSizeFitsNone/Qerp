import { ChangeDetectorRef, Component } from '@angular/core';
import { IContactrole } from 'src/app/interfaces/contactrole';
import { ContactroleService } from 'src/app/services/settings/contactrole.service';

@Component({
  selector: 'az-contactroles',
  templateUrl: './contactroles.component.html',
  styleUrls: ['./contactroles.component.scss'],
  providers: [ContactroleService]
})

export class ContactrolesComponent {
  private contactroles: Array<IContactrole> = [];
  public contactrole: IContactrole = <IContactrole>{};

  public crSearch: string = "";
  public crsSearch: Array<IContactrole> = [];

  public selectedId = 0;

  constructor(
    private contactroleService: ContactroleService,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.contactroleService.contactroles.subscribe(crs => {
      this.contactroles = crs
      this.crsSearch = this.contactroles.filter(cr => this.crSearch == "" || cr.id == 0 || cr.name.toLowerCase().startsWith(this.crSearch.toLowerCase()));
    });
    this.contactroleService.contactrole.subscribe(cr => {
      this.contactrole = cr; 
    });
    this.contactroleService.getContactroles();
  }

  public onInputChange() {
    this.crsSearch = this.contactroles.filter(cr => this.crSearch == "" || cr.id == 0 || cr.name.toLowerCase().includes(this.crSearch.toLowerCase()));
  }

  public onCreateRole() {
    this.contactroleService.createContactrole();
  }

  public editContactrole(oContactrole) {
    this.contactroleService.getContactrole(oContactrole.id);
  }

  public saveContactrole(oContactrole: IContactrole) {
    this.contactroleService.saveRole(oContactrole);
  }

  public deleteContactrole(oContactrole: IContactrole) {
    this.contactroleService.deleteRole(oContactrole);
  }
}
