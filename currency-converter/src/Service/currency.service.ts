import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  //if there any problem with data => sign up to this link to  get new ApiKey
  // https://apilayer.com/marketplace/fixer-api?utm_source=apilayermarketplace&utm_medium=featured%3Fe=Sign+In&l=Success&e=Sign+In&l=Success
  private apiKey = "OQPitJ8RAgbX4CVKBuytrYtBc5zsS5bZ";    
  private apiUrl = "https://api.apilayer.com/fixer";
 
  symbols: any = {};
  constructor(private http: HttpClient) {
    this.getSymbols().subscribe(
      data => {
        this.symbols = data.symbols;
      },
      error => {
        console.log(error);
      }
    );
  }
  // to get selected  amount,base,target  currency  to  display it  in  details component
  private currencyForm = new BehaviorSubject<FormGroup>(new FormGroup({
    baseCurrency: new FormControl(),
    targetCurrency: new FormControl(),
    amount: new FormControl()
  }));
  getCurrencyForm() {
    return this.currencyForm.asObservable();
  }
  setCurrencyForm(form: FormGroup) {
    this.currencyForm.next(form);
  }
// ---------------------API
  getSymbols(): Observable<any> {
    const url = `${this.apiUrl}/symbols?apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
  getConvert(to:any, from:any,amount:any):Observable<any>{
    const url=`${this.apiUrl}/convert?to=${to}&from=${from}&amount=${amount}&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
  
  getLatestRates(base: string, symbols: string): Observable<any> {
    const url = `${this.apiUrl}/latest?apikey=${this.apiKey}&base=${base}&symbols=${symbols}`;
    return this.http.get<any>(url);
  }
getTimeseries(startDate:any,endDate:any):Observable<any>{
const url = `${this.apiUrl}/timeseries?apikey=${this.apiKey}&start_date=${startDate}&end_date=${endDate}`
    return this.http.get<any>(url);
}
}
