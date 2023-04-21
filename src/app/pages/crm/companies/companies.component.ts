import { ChangeDetectorRef, Component } from '@angular/core';
import { AppTypes } from 'src/app/interfaces/apptypes';
import { ICity } from 'src/app/interfaces/city';
import { IClient } from 'src/app/interfaces/client';
import { ICountry } from 'src/app/interfaces/country';
import { IProvince } from 'src/app/interfaces/province';
import { CompanyService } from 'src/app/services/crm/company/company.service';
import { CityService } from 'src/app/services/general/city.service';
import { CountryService } from 'src/app/services/general/country.service';
import { ProvinceService } from 'src/app/services/general/province.service';
import { SearchhistoryService } from 'src/app/services/user/searchhistory.service';

@Component({
  selector: 'az-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [ CompanyService, CountryService, ProvinceService, CityService ]
})

export class CompaniesComponent {
  public companies: Array<IClient> = [];
  public company: IClient = <IClient>{};
  public selectedId: number = 0;
  
  public advancedSearch: boolean = false;
  
  public countries: Array<ICountry> = [];
  public provinces: Array<IProvince> = [];
  public cities: Array<ICity> = [];
  
  public apptypes: AppTypes = new AppTypes;

  constructor(
    private companyService: CompanyService,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private ref: ChangeDetectorRef,
    private searchHistory: SearchhistoryService,
  ){

  }

  async ngOnInit() {
    this.countries = await this.countryService.getListForDD();
    this.company.city = <ICity>{}
    this.company.invoiceCity = <ICity>{}
    this.companyService.companies.subscribe(c => {
      this.companies = c;
    });
    let oHistory = this.searchHistory.getHistory(this.apptypes.client);
    if(oHistory) {
      this.company = <IClient>oHistory;
      this.onSearch();
    }
  }

  onSearch() {
    if(this.company.city.provinceId == null) { delete this.company.city.provinceId; }
    if(this.company.city.provinceId == null) { delete this.company.city.provinceId; }
    this.companyService.findCompany(this.company);
    this.searchHistory.addHistory(this.apptypes.client, this.company);
  }

  onInputChange(item: string) {
    let object = item.includes(".") ? this.company[item.split(".")[0]][item.split(".")[1]] : this.company[item]
    let search: boolean = false;
    let hasOtherKeys: boolean = false;

    for(let key of Object.keys(this.company)) {
      if(key != item && this.company[key] != null && this.company[key].length > 0) {
        hasOtherKeys = true;
      }
    }

    if(item != "city.countryId" && this.company.city.countryId != null) { hasOtherKeys = true }
    if(item != "city.provinceId" && this.company.city.provinceId != null) { hasOtherKeys = true }

    if((hasOtherKeys && (object.length > 0 || Number(object) > 0)) || (!hasOtherKeys && (object.length > 2 || Number(object) > 0)) ) {
      search = true;
    }
    else if(!hasOtherKeys && object.length == 0) {
      this.companies = []
    }

    if(search) {
      if(this.company.city.provinceId == null) { delete this.company.city.provinceId; }
      if(this.company.city.provinceId == null) { delete this.company.city.provinceId; }
      this.companyService.findCompany(this.company);
      this.searchHistory.addHistory(this.apptypes.client, this.company);
    }

  }

  async changeCountry(event: any) {
    this.company.cityId = null;
    this.company.city.provinceId = null;

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
    this.company.cityId = null;

    if(event != null) {
      this.cities = await this.cityService.getListForDDByProvince(event);
    }
    else {
      this.cities = [];
    }
    this.onInputChange("city.provinceId")
  }

}
