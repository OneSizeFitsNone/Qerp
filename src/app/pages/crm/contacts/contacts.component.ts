import { ChangeDetectorRef, Component } from '@angular/core';
import { ICity } from 'src/app/interfaces/city';
import { IContact } from 'src/app/interfaces/contact';
import { ICountry } from 'src/app/interfaces/country';
import { IProvince } from 'src/app/interfaces/province';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { CityService } from 'src/app/services/general/city.service';
import { CountryService } from 'src/app/services/general/country.service';
import { ProvinceService } from 'src/app/services/general/province.service';

@Component({
  selector: 'az-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [ContactService, CountryService, ProvinceService, CityService]
})
export class ContactsComponent {
  public contacts: Array<IContact> = []
  public contact: IContact = <IContact>{};
  public selectedId: number = 0;

  public showContact: boolean = false;
  public advancedSearch: boolean = false;
  
  public countries: Array<ICountry> = [];
  public provinces: Array<IProvince> = [];
  public cities: Array<ICity> = [];
  
  constructor(
    private contactService: ContactService,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private ref: ChangeDetectorRef
  ){

  }

  async ngOnInit() {
    this.countries = await this.countryService.getListForDD();
    this.contact.city = <ICity>{}
    this.contactService.contacts.subscribe(c => {
      this.contacts = c;
    });
  }

  onSearch() {
    if(this.contact.city.provinceId == null) { delete this.contact.city.provinceId; }
    if(this.contact.city.countryId == null) { delete this.contact.city.countryId; }
    this.contactService.findContact(this.contact);
  }

  addContact() {
    this.selectedId = 0;
    this.showContact = true;
  }

  onInputChange(item: string) {
    let object = item.includes(".") ? this.contact[item.split(".")[0]][item.split(".")[1]] : this.contact[item]
    let search: boolean = false;
    let hasOtherKeys: boolean = false;

    for(let key of Object.keys(this.contact)) {
      if(key != item && this.contact[key] != null && this.contact[key].length > 0) {
        hasOtherKeys = true;
      }
    }

    if(item != "city.countryId" && this.contact.city.countryId != null) { hasOtherKeys = true }
    if(item != "city.provinceId" && this.contact.city.provinceId != null) { hasOtherKeys = true }

    if((hasOtherKeys && (object.length > 0 || Number(object) > 0)) || (!hasOtherKeys && (object.length > 2 || Number(object) > 0)) ) {
      search = true;
    }
    else if(!hasOtherKeys && object.length == 0) {
      this.contacts = []
    }

    if(search) {
      if(this.contact.city.provinceId == null) { delete this.contact.city.provinceId; }
      if(this.contact.city.provinceId == null) { delete this.contact.city.provinceId; }
      this.contactService.findContact(this.contact);
    }

  }

  async changeCountry(event: any) {
    this.contact.cityId = null;
    this.contact.city.provinceId = null;

    if(event != null) {
      this.provinces = await this.provinceService.getListForDDByCountry(event);
    }
    else {
      this.provinces = [];
    }
    
    this.cities = [];
    this.onInputChange("city.countryId")
  }

  async changeProvince(event: any) {
    this.contact.cityId = null;

    if(event != null) {
      this.cities = await this.cityService.getListForDDByProvince(event);
    }
    else {
      this.cities = [];
    }
    this.onInputChange("city.provinceId")
  }
}
