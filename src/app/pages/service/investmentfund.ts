import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvestmentFund } from '../domain/investmentfund';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvestmentFundService {

  private baseUrl = environment.apiBaseUrl.investmentFunds; // 🔥 Usando environment

  constructor(private http: HttpClient) {}

  getInvestmentFunds(): Observable<InvestmentFund[]> {
    return this.http.get<InvestmentFund[]>(`${this.baseUrl}`);
  }

  getInvestmentFund(id: string): Observable<InvestmentFund> {
    return this.http.get<InvestmentFund>(`${this.baseUrl}/${id}`);
  }

  createInvestmentFund(data: InvestmentFund): Observable<InvestmentFund> {
    return this.http.post<InvestmentFund>(`${this.baseUrl}`, data);
  }

  updateInvestmentFund(id: string, data: InvestmentFund): Observable<InvestmentFund> {
    return this.http.put<InvestmentFund>(`${this.baseUrl}/${id}`, data);
  }

  deleteInvestmentFund(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
