import { NgModule } from '@angular/core';
import * as pTable from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './component/table.component';
import { InputFilterComponent } from './filters/input-filter/input-filter.component';
import {InputTextModule} from 'primeng/inputtext';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown'
import { SelectFilterComponent } from './filters/select-filter/select-filter.component';
import {MultiSelectModule} from 'primeng/multiselect';

@NgModule({
	declarations: [
	TableComponent,
	InputFilterComponent,
	SelectFilterComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		pTable.TableModule,
		InputTextModule,
		ContextMenuModule,
		DropdownModule,
		MultiSelectModule
	],
	providers: [
	],
	exports: [
	TableComponent,
	InputFilterComponent,
	SelectFilterComponent
	]
})
export class TableModule {

}
