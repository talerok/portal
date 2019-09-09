import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ColumnFiltration, ColumnFiltrationType } from '../../interfaces/column-filtration';

@Component({
	selector: 'app-table-input-filter',
	templateUrl: './input-filter.component.html',
	styleUrls: ['./input-filter.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFilterComponent {

	@Input() isNumber = false;
	@Input() placeholder = '';
	@Input() mode = ColumnFiltrationType.CT;

	@Output() filter = new EventEmitter<ColumnFiltration>();

	@ViewChild('input', { static: true }) input: ElementRef;

	public value: string;

	private _applyFilter() {
		const filter = this.value ? {
			value: this.isNumber ? Number(this.value) : this.value,
			type: this.mode
		} : null;

		this.filter.emit(filter);
	}

	public onBlur() {
		this._applyFilter();
	}

	public onKeyDown($event) {
		if ($event.keyCode === 13) {
			this.input.nativeElement.blur();
		}
	}

}
