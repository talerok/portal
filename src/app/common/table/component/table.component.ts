import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TableColumn } from '../models/table-column';
import { TableValueProvider, TableValueProviderResponse } from '../interfaces/table-value-provider';
import { ColumnFiltration } from '../interfaces/column-filtration';
import { take, takeUntil, skip } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { LocalValueProviderFactory } from '../valueProviders/local-value-provider-factory';
import { BehaviorSubject, Subject } from 'rxjs';

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
        if(Array.isArray(val)) {
            this._valueProvider$.next(LocalValueProviderFactory.get(val));
        } else {
            this._valueProvider$.next(val);
        }
    }

    @Input() pageSize = 15;

    private _lastData: TableValueProviderResponse = null;
    private _filters: {[column: string]: ColumnFiltration;} = {};

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
        } else if(typeof(column.valueProvider) === 'function') {
            return this.funcTemplate;
        } else {
            return column.valueProvider;
        }
    }
    
    public generateFilterFunc(column: TableColumn) {
        return (filter: ColumnFiltration) => {
            if (filter) {
                this._filters[column.field] = filter;
            } else if(this._filters[column.field]) {
                delete(this._filters[column.field]);
            }
            this.reset();
        };
    }

    private _load() {
        if (!this.valueProvider) {
            return;
        }

        const sorting = this.table.sortField ? {column: this.table.sortField, direction: this.table.sortOrder} : null;
        const page = this.table.first / this.pageSize + 1;
        this.loading = true;
        this.valueProvider({
            page: page,
            size: this.pageSize,
            sotring: sorting,
            filtration: this._filters
        })
        .pipe(
            take(1)
        )
        .subscribe(x => {
            this._lastData = x;
            this._changeDetectorRef.markForCheck();
        },
        err => {},
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
        this.table.sortField = null;
        this._load();
    }

    constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        this._takeUntil$
        .pipe(
            takeUntil(this._takeUntil$),
            skip(1)
        ).subscribe(x => this.reset());
    }

    ngOnDestroy() {
        this._takeUntil$.next(true);
    }

}
