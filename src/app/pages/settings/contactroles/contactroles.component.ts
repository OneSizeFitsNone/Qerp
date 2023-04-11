import { Component } from '@angular/core';
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
  ) {
    this.contactroleService.contactroles.subscribe(crs => {
      this.contactroles = crs
      this.crsSearch = this.contactroles.filter(cr => this.crSearch == "" || cr.name.startsWith(this.crSearch));
    });
    this.contactroleService.contactrole.subscribe(cr => {
      this.contactrole = cr; 
    });
  }

  ngOnInit() {
    this.contactroleService.getContactroles();
  }

  public onInputChange() {
    this.crsSearch = this.contactroles.filter(cr => this.crSearch == "" || cr.name.toLowerCase().includes(this.crSearch.toLowerCase()));
  }

  public saveContactrole(oContactrole: IContactrole) {
    
  }
}
