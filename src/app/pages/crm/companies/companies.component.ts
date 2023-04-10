import { Component } from '@angular/core';
import { IClient } from 'src/app/interfaces/client';
import { CompanyService } from 'src/app/services/crm/company/company.service';

@Component({
  selector: 'az-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [ CompanyService ]
})

export class CompaniesComponent {
  public companies: Array<IClient> = []
  public company: IClient = <IClient>{};
  
  constructor(
    private companyService: CompanyService,
  ){

  }

  ngOnInit() {
    this.companyService.companies.subscribe(c => {
      this.companies = c;
    });
  }

  onSearch() {
    this.companyService.findCompany(this.company);
  }
}
