import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CurrencyService } from 'src/Service/currency.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements  OnInit{
  
  title = 'Fixer API Demo';
  response: any;
  error: any;
  symbols: any;
  baseCurrency: any;
  targetCurrency: any ;
  amount:any;
  exchangeRate: number = 0;
  exchangeRate2:any;
  currencyForm!: FormGroup;
  baseCurrencyName:string='';

  formHandler(e:any){
 
    }
  constructor(private Route: ActivatedRoute ,private http: HttpClient, private currencyService: CurrencyService) {
    this.currencyService.getCurrencyForm().subscribe(form => {
      this.currencyForm = form;
    }); 
  }
  getSymbols() {
    this.currencyService.getSymbols().subscribe(
      data => { 
        this.response = data; this.error = null;
        this.symbols=this.response.symbols
        console.log(this.response.symbols); 
       
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
      },
      error => {
        this.response = null;
        this.error = error.message;
      }
    );
    this.generateChart();
}
  
  getExchangeRate(): void {
    this.currencyService.getConvert(this.targetCurrency, this.baseCurrency, this.amount).subscribe(
      data => {
        this.exchangeRate = data.result;
        // console.log(this.exchangeRate);
      },
      error => {
        console.log(error);
      }
    );
  }
  getExchangeRate2(): void {
    const amount=1;
    this.currencyService.getConvert(this.targetCurrency, this.baseCurrency, amount).subscribe(
      data => {
        this.exchangeRate2 = data.result;
        // console.log(this.exchangeRate);
      },
      error => {
        console.log(error);
      }
    );
  }
  ngOnInit(): void {
    this.getSymbols();
    this.generateChart();
    this.currencyService.getCurrencyForm().subscribe(form => {
      this.currencyForm = form;
      this.baseCurrency = this.currencyForm.value.baseCurrency;
      this.targetCurrency = this.currencyForm.value.targetCurrency;
      this.amount = this.currencyForm.value.amount;
      this.getExchangeRate();
      this.getExchangeRate2();
      this.baseCurrencyName = this.currencyService.symbols[this.baseCurrency];
     
    });
  // this.getExchangeRate()
  
  }
  generateChart() {
    const fromCurrency = this.currencyForm.value.targetCurrency;
    const toCurrency = this.currencyForm.value.baseCurrency;
  
    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Get date one year ago
    const endDate = new Date().toISOString().slice(0, 10); // Get today's date
  
    this.currencyService.getTimeseries(startDate, endDate).subscribe((data) => {
      const rates = data.rates;
  
      const monthlyRates = [];
  
      let prevMonth = '';
      let lastRate = 0;
  
      for (const date in rates) {
        const month = date.slice(0, 7);
        const day = date.slice(8, 10);
        if (month !== prevMonth) {
          if (prevMonth) {
            monthlyRates.push({ date: prevMonth, rate: lastRate });
          }
          lastRate = 0;
          prevMonth = month;
        }
        if (day === '28' || day === '29' || day === '30' || day === '31') {
          const rate = rates[date][toCurrency] / rates[date][fromCurrency];
          lastRate = rate;
        }
      }
  
      monthlyRates.push({ date: prevMonth, rate: lastRate });
  
      const chartData = {
        labels: monthlyRates.map((rate) => rate.date),
        datasets: [
          {
            label: `${toCurrency}/${fromCurrency}`,
            data: monthlyRates.map((rate) => rate.rate),
          },
        ],
      };
  
      const chartOptions = {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Exchange Rate',
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Month',
              },
            },
          ],
        },
      };
  
      const chart = new Chart(document.getElementById('chart') as HTMLCanvasElement, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    });
  }

}
