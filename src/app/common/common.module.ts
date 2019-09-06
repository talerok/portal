import { NgModule } from '@angular/core';
import { TableComponent } from './table/component/table.component';
import {TableModule} from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
      TableComponent
    ],
    imports: [
        BrowserModule,
        TableModule
    ],
    providers: [
    ],
    exports: [
      TableComponent
    ]
  })
  export class CommonModule {

  }
