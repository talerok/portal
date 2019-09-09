import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TableColumn } from '../models/table-column';
import { TableSelectionType } from '../models/selection-type';
import { TableValueProvider, TableValueProviderResponse } from '../interfaces/table-value-provider';
import { ColumnFiltration } from '../interfaces/column-filtration';
import { take, takeUntil, skip } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { LocalValueProviderFactory } from '../valueProviders/local-value-provider-factory';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnDestroy {

	@ViewChild('valueTemplate', { static: true }) valueTemplate: TemplateRef<any>;
	@ViewChild('funcTemplate', { static: true }) funcTemplate: TemplateRef<any>;
	@ViewChild(Table, { static: true }) table: Table;

	@Input() columns: TableColumn[] = null;
	private _valueProvider$ = new BehaviorSubject<TableValueProvider>(null);
	private _takeUntil$ = new Subject<boolean>();

	public get valueProvider(): TableValueProvider {
		return this._valueProvider$.value;
	}

	@Input() set value(val: any[] | TableValueProvider) {
		if (Array.isArray(val)) {
			this._valueProvider$.next(LocalValueProviderFactory.get(val));
		} else {
			this._valueProvider$.next(val);
		}
	}

	@Input() set globalFilters(value: { [column: string]: ColumnFiltration; }) {
		this._globalFilters = value;
		this.reset();
	}

	@Input() pageSize = 15;
	@Input() contextMenu: MenuItem[] = null;
	@Input() selectionType: TableSelectionType = TableSelectionType.single;

	private _selection: any[] = [];

	@Input() set selection(value: any[]) {
		this._selection = this.selection;
	}

	@Output() selectionChange = new EventEmitter<any[]>();

	get selection(): any[] {
		return this._selection;
	}

	public onSelectionChange(data: any[]) {
		this._selection = data;
		this.selectionChange.emit(data);
	}


	public getSelectionType() {
		return this.selectionType === TableSelectionType.multiple || this.selectionType === TableSelectionType.single ?
			this.selectionType : null;
	}

	private _lastData: TableValueProviderResponse = null;
	private _filters: { [column: string]: ColumnFiltration; } = {};
	private _globalFilters: { [column: string]: ColumnFiltration; } = {};

	public loading = false;

	public get rows(): any[] {
		return this._lastData && this._lastData.result ? this._lastData.result : [];
	}

	public get total(): number {
		return this._lastData && this._lastData.total ? this._lastData.total : 0;
	}

	public get hasFilters(): boolean {
		return this.columns.some(x => x.filtration)
	}

	public getTemplate(column: TableColumn): TemplateRef<any> {
		if (!column.valueProvider) {
			return this.valueTemplate;
		} else if (typeof (column.valueProvider) === 'function') {
			return this.funcTemplate;
		} else {
			return column.valueProvider;
		}
	}

	public generateFilterFunc(column: TableColumn) {
		return (filter: ColumnFiltration) => {
			if (filter) {
				this._filters[column.field] = filter;
			} else if (this._filters[column.field]) {
				delete (this._filters[column.field]);
			}
			this.reset();
		};
	}

	private _generateFilters() {
		return Object.assign({}, this._filters, this._globalFilters);
	}

	private _load() {
		if (!this.valueProvider) {
			return;
		}
		const sorting = this.table.sortField ? { column: this.table.sortField, direction: this.table.sortOrder } : null;
		const page = this.table.first / this.pageSize + 1;
		this.loading = true;
		this.onSelectionChange(null);
		this.valueProvider({
			page: page,
			size: this.pageSize,
			sotring: sorting,
			filtration: this._generateFilters()
		})
			.pipe(
				take(1)
			)
			.subscribe(x => {
				this._lastData = x;
				this._changeDetectorRef.markForCheck();
			},
				err => { },
				() => {
					this.loading = false;
				});
	}

	public setPage(page: number) {
		this.table.first = page * this.pageSize;
		this._load();
	}

	public load(event) {
		setTimeout(() => {
			this._load();
		});
	}

	public reset() {
		this.table.first = 0;
		this.table.sortOrder = 0;
		this.table.sortField = '';
		this.table.reset();
	}

	constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {

	}

	ngOnInit() {
		this._valueProvider$
			.pipe(
				takeUntil(this._takeUntil$),
				skip(1)
			).subscribe(x => {
				this.reset();
			});
	}

	ngOnDestroy() {
		this._takeUntil$.next(true);
	}

}
