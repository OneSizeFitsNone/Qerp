import { ChangeDetectorRef, Component } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { ICountry } from 'src/app/interfaces/country';
import { IProvince } from 'src/app/interfaces/province';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { CityService } from 'src/app/services/general/city.service';
import { CountryService } from 'src/app/services/general/country.service';
import { ProvinceService } from 'src/app/services/general/province.service';
import { ISaveditem } from 'src/app/interfaces/saveditem';
import { SaveditemService } from 'src/app/services/user/saveditems.service';

@Component({
  selector: 'az-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [CompanyService, CountryService, ProvinceService, CityService]
})

export class CompanyComponent {
  public id: number;

  public personalForm:UntypedFormGroup;
  public company: IClient = <IClient>{};
  public countries: Array<ICountry> = [];
  public provinces: Array<IProvince> = [];
  public cities: Array<ICity> = [];
  public invoiceProvinces: Array<IProvince> = [];
  public invoiceCities: Array<ICity> = [];
  public appTypes: AppTypes = new AppTypes();

  public tabIndex = 0;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    private saveditemService: SaveditemService,
    public router: Router
  ) { 
    
  }

  async ngOnInit() {

    this.personalForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', Validators.compose([emailValidator])],
      'website': [''],
      'phone': [''],
      'mobile': [''],
      'cityId': [''],
      'city': this.formBuilder.group({
        'countryId': [''],
        'provinceId': ['']
      }),
      'address' : [''],
      'invoiceSameAddress': [''],
      'invoiceCityId': [''],
      'invoiceCity': this.formBuilder.group({
        'countryId': [''],
        'provinceId': ['']
      }),
      'invoiceEmail': ['', Validators.compose([emailValidator])],
      'invoiceAddress' : [''],
      'vat' : [''],
      'iban' : [''],
      'description' : ['']
    });

    this.companyService.company.subscribe(async c => {
      this.company = c;
      if(this.company.city?.countryId) {
        this.provinces = await this.provinceService.getListForDDByCountry(this.company.city.countryId)
      }
      if(this.company.city?.provinceId) {
        this.cities = await this.cityService.getListForDDByProvince(this.company.city.provinceId)
      }
      if(this.company.invoiceCity?.countryId) {
        this.invoiceProvinces = await this.provinceService.getListForDDByCountry(this.company.invoiceCity.countryId)
      }
      if(this.company.invoiceCity?.provinceId) {
        this.invoiceCities = await this.cityService.getListForDDByProvince(this.company.invoiceCity.provinceId)
      }
      this.ref.detectChanges();
      this.personalForm.patchValue(this.company);
    });

    this.countries = await this.countryService.getListForDD();

    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if(this.id == 0) {
        this.companyService.createCompany();
      }
      else {
        this.companyService.getCompany(this.id);
      }
    });
  }

  onSubmit() {
    this.company = { ...this.company, ...this.personalForm.value}; 
    this.companyService.saveCompany(this.company);
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

  async changeInvoiceProvince(event: any) {
    this.personalForm.controls['invoiceCityId'].setValue(null);
    let provinceId = Number.isInteger(event) ? event : event.value;
    this.invoiceCities = await this.cityService.getListForDDByProvince(provinceId);

  }

  async changeInvoiceCountry(event: any) {
    this.personalForm.controls['invoiceCityId'].setValue(null);
    this.personalForm.get('invoiceCity.provinceId').setValue(null);

    let countryId = Number.isInteger(event) ? event : event.value;
    this.invoiceProvinces = await this.provinceService.getListForDDByCountry(countryId);
    this.invoiceCities = []
  }

  async undoChanges() {
    if(this.company.city?.countryId) {
      this.provinces = await this.provinceService.getListForDDByCountry(this.company.city.countryId)
    }
    if(this.company.city?.provinceId) {
      this.cities = await this.cityService.getListForDDByProvince(this.company.city.provinceId)
    }
    if(this.company.invoiceCity?.countryId) {
      this.provinces = await this.provinceService.getListForDDByCountry(this.company.invoiceCity.countryId)
    }
    if(this.company.invoiceCity?.provinceId) {
      this.cities = await this.cityService.getListForDDByProvince(this.company.invoiceCity.provinceId)
    }

    this.ref.detectChanges();
    this.personalForm.patchValue(this.company);
  }

  public async saveItem(){
    let oSavedItem: ISaveditem = <ISaveditem>{};
    oSavedItem.id = 0;
    oSavedItem.name = this.company.name;
    oSavedItem.apptypeId = this.appTypes.client;
    oSavedItem.routelink = this.router.url;
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