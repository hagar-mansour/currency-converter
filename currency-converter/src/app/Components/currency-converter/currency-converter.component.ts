import { Component,OnInit, Injectable } from '@angular/core';
import { CurrencyService } from 'src/Service/currency.service';
import{FormControl,FormGroup} from '@angular/forms'

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements  OnInit {

  title = 'Fixer API Demo';
  response: any;
  error: any;
  symbols:any;
  itrate:any;
  amount: any;
  baseCurrency: any;
  targetCurrency: any;
  exchangeRate: number=0;
  currencies: any;
  cardCarances:any;
  exchangeRate2:any;
  currencyForm: FormGroup;
  baseCurrencyName:string='';
  selectedBaseCurrency = new FormControl('EUR');
  selectedTargetCurrency = new FormControl('USD');
  
  constructor(private currencyService:CurrencyService) {
    this.currencyForm = new FormGroup({
       baseCurrency: this.selectedBaseCurrency,
      targetCurrency: this.selectedTargetCurrency,
      amount: new FormControl()
    });
    this.currencyService.setCurrencyForm(this.currencyForm);
  }
ngOnInit(): void {
    this.getSymbols();
}
formHandler(e:any){

  }
  get getAmount(){
    return  this.amount.controls['amount']
  }
  get getBase(){
    return  this.baseCurrency.controls['baseCurrency']
  }
  get getTarget(){
    return  this.targetCurrency.controls['targetCurrency']
  }

  getSymbols() {
    this.currencyService.getSymbols().subscribe(
      data => { 
        this.response = data; this.error = null;
        this.symbols=this.response.symbols
        // console.log(this.response.symbols); 
       
       },
      error => { this.response = null; this.error = error.message; }
    );
  }
  getConvert() {
    
      const to = this.currencyForm.value.targetCurrency;
      const from = this.currencyForm.value.baseCurrency;
      const amount =this.currencyForm.value.amount;     
  
      this.currencyService.getConvert(to, from, amount).subscribe(
        data => {
          this.response = data;
          this.error = null;
          this.exchangeRate = this.response.result;
          this.baseCurrencyName = this.symbols[from];
          // console.log(this.symbols[from]);
          // console.log(this.response.result);
          
        },
        error => {
          this.response = null;
          this.error = error.message;
        }
      );
      
      this.getamountff();
      this.getLatestRates();
  }


  getamountff() {
    
    const to = this.currencyForm.value.targetCurrency;
    const from = this.currencyForm.value.baseCurrency;
    const amount ='1';     
    
    

    this.currencyService.getConvert(to, from, amount).subscribe(
      data => {
        this.response = data;
        this.error = null;
        this.exchangeRate2 = this.response.result;
        // console.log(this.response.result); 
      },
      error => {
        this.response = null;
        this.error = error.message;
        console.log(this.error);
        
      }
    );
}


  
  getLatestRates() {
    const from = this.currencyForm.value.baseCurrency!.toString();
    this.currencyService.getLatestRates(from,'USD,EUR,EGP,BIF,BRL,DKK,GNF,JPY,KWD').subscribe(
      data => { this.response = data; this.error = null;
      this.cardCarances=this.response.rates;
    
      
    },
      error => { this.response = null; this.error = error.message; }
    );
  }
}