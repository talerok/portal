import { NgModule } from '@angular/core';
import * as pTable from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TableComponent } from './component/table.component';
import { InputFilterComponent } from './filters/input-filter/input-filter.component';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
    declarations: [
      TableComponent,
      InputFilterComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        pTable.TableModule,
        InputTextModule
    ],
    providers: [
    ],
    exports: [
      TableComponent,
      InputFilterComponent
    ]
  })
  export class TableModule {

  }
