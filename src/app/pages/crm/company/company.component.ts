import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { ICompany } from 'src/app/interfaces/company';
import { ICountry } from 'src/app/interfaces/country';
import { IProvince } from 'src/app/interfaces/province';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { CityService } from 'src/app/services/general/city.service';
import { CountryService } from 'src/app/services/general/country.service';
import { ProvinceService } from 'src/app/services/general/province.service';

@Component({
  selector: 'az-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  providers: [CompanyService, CountryService, ProvinceService, CityService]
})

export class CompanyComponent {
  @Input() id: number;
  @Output() showCompany = new EventEmitter<boolean>(false);

  public personalForm:UntypedFormGroup;
  public company: IClient = <IClient>{};
  public countries: Array<ICountry> = [];
  public provinces: Array<IProvince> = [];
  public cities: Array<ICity> = [];
  public invoiceProvinces: Array<IProvince> = [];
  public invoiceCities: Array<ICity> = [];
  public appTypes: AppTypes = new AppTypes();
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private ref: ChangeDetectorRef
  ) { 
    
  }

  async ngOnInit() {

    this.personalForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'phone': [''],
      'mobile': [''],
      'cityId': ['', Validators.required],
      'city': this.formBuilder.group({
        'countryId': ['', Validators.required],
        'provinceId': ['', Validators.required]
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
        this.invoiceProvinces = await this.provinceService.getListForDDByCountry(this.company.city.countryId)
      }
      if(this.company.invoiceCity?.provinceId) {
        this.invoiceCities = await this.cityService.getListForDDByProvince(this.company.city.provinceId)
      }
      this.ref.detectChanges();
      this.personalForm.patchValue(this.company);
    });

    this.countries = await this.countryService.getListForDD();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["id"]) {
      if(this.id == 0) {
        this.companyService.createCompany();
      }
      else {
        this.companyService.getCompany(this.id);
      }
    }
  }

  onSubmit() {
    this.company = { ...this.company, ...this.personalForm.value}; 
    this.companyService.saveCompany(this.company);
  }

  close() {
    this.showCompany.emit(false);
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

  async changeInvoiceProvince(event: any) {
    this.personalForm.controls['invoiceCityId'].setValue(null);
    let provinceId = Number.isInteger(event) ? event : event.target.value;
    this.invoiceCities = await this.cityService.getListForDDByProvince(provinceId);

  }

  async changeInvoiceCountry(event: any) {
    this.personalForm.controls['invoiceCityId'].setValue(null);
    this.personalForm.get('invoiceCity.provinceId').setValue(null);

    let countryId = Number.isInteger(event) ? event : event.target.value;
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

}

export function emailValidator(control: UntypedFormControl): {[key: string]: any} {
  var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
  if (control.value && !emailRegexp.test(control.value)) {
      return {invalidEmail: true};
  }
}