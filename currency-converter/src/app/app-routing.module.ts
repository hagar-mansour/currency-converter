import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyConverterComponent } from './Components/currency-converter/currency-converter.component';
import { CurrencyDetailsComponent } from './Components/currency-details/currency-details.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
const routes: Routes = [
  { path:'',component:CurrencyConverterComponent},
  { path:'converter',component:CurrencyConverterComponent},
  { path:'details',component:CurrencyDetailsComponent},
  { path:'**',component:NotfoundComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
