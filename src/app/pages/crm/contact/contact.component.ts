import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators} from '@angular/forms';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IContact } from 'src/app/interfaces/contact';
import { ICountry } from 'src/app/interfaces/country';
import { IProvince } from 'src/app/interfaces/province';
import { ContactService } from 'src/app/services/crm/contact/contact.service';
import { CityService } from 'src/app/services/general/city.service';
import { CountryService } from 'src/app/services/general/country.service';
import { ProvinceService } from 'src/app/services/general/province.service';

@Component({
  selector: 'az-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [ContactService, CountryService, ProvinceService, CityService, AppTypes]
})
export class ContactComponent {
  @Input() id: number;
  @Output() showContact = new EventEmitter<boolean>(false);

  public personalForm:UntypedFormGroup;
  public contact: IContact = <IContact>{};
  public countries: Array<ICountry> = [];
  public provinces: Array<IProvince> = [];
  public cities: Array<ICity> = [];
  public appTypes: AppTypes = new AppTypes();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private contactService: ContactService,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private ref: ChangeDetectorRef
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["id"]) {
      if(this.id == 0) {
        this.contactService.createContact();
      }
      else {
        this.contactService.getContact(this.id);
      }
    }
  }

  onSubmit() {
    this.contact = { ...this.contact, ...this.personalForm.value}; 
    this.contactService.saveContact(this.contact);
  }

  close() {
    this.showContact.emit(false);
  }

  async changeProvince(event: any) {
    this.personalForm.controls['cityId'].setValue(null);
    let provinceId = Number.isInteger(event) ? event : event.target.value;
    this.cities = await this.cityService.getListForDDByProvince(provinceId);

  }

  async changeCountry(event: any) {
    this.personalForm.controls['cityId'].setValue(null);
    this.personalForm.get('city.provinceId').setValue(null);

    let countryId = Number.isInteger(event) ? event : event.target.value;
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
  }
  
}

export function emailValidator(control: UntypedFormControl): {[key: string]: any} {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
  if (control.value && !emailRegexp.test(control.value)) {
      return {invalidEmail: true};
  }
}