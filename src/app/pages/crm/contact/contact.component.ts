import { ChangeDetectorRef, Component } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IContact } from 'src/app/interfaces/contact';
import { ICountry } from 'src/app/interfaces/country';
import { IProvince } from 'src/app/interfaces/province';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { CityService } from 'src/app/services/general/city.service';
import { CountryService } from 'src/app/services/general/country.service';
import { ProvinceService } from 'src/app/services/general/province.service';
import { SaveditemService } from 'src/app/services/user/saveditems.service';
import { ISaveditem } from 'src/app/interfaces/saveditem';

@Component({
  selector: 'az-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [ContactService, CountryService, ProvinceService, CityService, AppTypes]
})
export class ContactComponent {
  public id: number;

  public personalForm:UntypedFormGroup;
  public contact: IContact = <IContact>{};
  public countries: Array<ICountry> = [];
  public provinces: Array<IProvince> = [];
  public cities: Array<ICity> = [];
  public appTypes: AppTypes = new AppTypes();

  public tabIndex = 0;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private contactService: ContactService,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    public routers: Router,
    private saveditemService: SaveditemService
  ) { 
    
  }

  async ngOnInit() {
    
    this.personalForm = this.formBuilder.group({
      //'salutation': ['d'],
      'name': ['', Validators.required],
      'surname': ['', Validators.required],
      //'gender': [''],
      'email': ['', Validators.compose([emailValidator])],
      'phone': [''],
      'mobile': [''],
      'cityId': [''],
      'city': this.formBuilder.group({
        'countryId': [''],
        'provinceId': ['']
      }),
      'address' : [''],
      'description' : ['']
    });

    this.contactService.contact.subscribe(async c => {
      this.contact = c;
      if(this.contact.city?.countryId) {
        this.provinces = await this.provinceService.getListForDDByCountry(this.contact.city.countryId)
      }
      if(this.contact.city?.provinceId) {
        this.cities = await this.cityService.getListForDDByProvince(this.contact.city.provinceId)
      }
      this.ref.detectChanges();
      this.personalForm.patchValue(this.contact);

    });

    this.countries = await this.countryService.getListForDD();

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if(this.id == 0) {
        this.contactService.createContact();
      }
      else {
        this.contactService.getContact(this.id);
      }
    });

    
    
  }

  onSubmit() {
    this.contact = { ...this.contact, ...this.personalForm.value}; 
    this.contactService.saveContact(this.contact);
  }

  goBack() {
    this.location.back();
  }

  async changeProvince(event: any) {
    this.personalForm.controls['cityId'].setValue(null);
    let provinceId = Number.isInteger(event) ? event : event.value;
    this.cities = await this.cityService.getListForDDByProvince(provinceId);

  }

  async changeCountry(event: any) {
    this.personalForm.controls['cityId'].setValue(null);
    this.personalForm.get('city.provinceId').setValue(null);

    let countryId = Number.isInteger(event) ? event : event.value;
    this.provinces = await this.provinceService.getListForDDByCountry(countryId);
    this.cities = []
  }

  async undoChanges() {
    if(this.contact.city?.countryId) {
      this.provinces = await this.provinceService.getListForDDByCountry(this.contact.city.countryId)
    }
    if(this.contact.city?.provinceId) {
      this.cities = await this.cityService.getListForDDByProvince(this.contact.city.provinceId)
    }

    this.ref.detectChanges();
    this.personalForm.patchValue(this.contact);
    this.ref.detectChanges();
  }

  public async saveItem(){
    let oSavedItem: ISaveditem = <ISaveditem>{};
    oSavedItem.id = 0;
    oSavedItem.name = this.contact.fullname;
    oSavedItem.apptypeId = this.appTypes.contact;
    oSavedItem.routelink = this.routers.url;
    this.saveditemService.save(oSavedItem);
  }

  public onTabIndexChange(i: any) {
    this.tabIndex=i;
  }
  
}

export function emailValidator(control: UntypedFormControl): {[key: string]: any} {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/;    
  if (control.value && !emailRegexp.test(control.value)) {
      return {invalidEmail: true};
  }
}