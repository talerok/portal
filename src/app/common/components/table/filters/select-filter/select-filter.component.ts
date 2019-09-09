import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ColumnFiltration, ColumnFiltrationType } from '../../interfaces/column-filtration';

@Component({
	selector: 'app-table-select-filter',
	templateUrl: './select-filter.component.html',
	styleUrls: ['./select-filter.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFilterComponent {

	@Input() placeholder = "Нет";
	@Input() options: any[] = null;
	@Input() multi = true;
	@Output() filter = new EventEmitter<ColumnFiltration>();

	public value: any = null;

	public apply() {
		if (!this.value || (Array.isArray(this.value) && !this.value.length)) {
			this.filter.emit(null);
		} else {
			this.filter.emit({
				value: this.value,
				type: ColumnFiltrationType.EQ
			});
		}
	}

}
