import { ColumnFiltration, ColumnFiltrationType } from '../interfaces/column-filtration';
import { ColumnSorting, TableValueProvider, TableValueProviderArguments } from '../interfaces/table-value-provider';
import { of } from 'rxjs';

export abstract class LocalValueProviderFactory {
    
    private static _filterValue(value: any, filter: ColumnFiltration): boolean {
        switch(filter.type) {
            case ColumnFiltrationType.LE:
                return value <= filter.value;
            case ColumnFiltrationType.ME:
                return value >= filter.value;
            case ColumnFiltrationType.IN:
                return value >= filter.value[0] && value <= filter.value[1];
            case ColumnFiltrationType.EQ:
                return Array.isArray(filter.value) ? filter.value.indexOf(value) !== -1 : filter.value === value;
            case ColumnFiltrationType.CT:
                const type = typeof(value);
                if (type === 'string' || Array.isArray(value)) {
                    return value.indexOf(filter.value) !== -1;
                } else if (type === 'boolean' || type === 'number') {
                    return String(value).indexOf(filter.value) !== -1;
                } else {
                    return false;
                }
        }
        return false;
    }

    private static _filterData(data: any[], filters: { [column: string]: ColumnFiltration; }): any[] {
        if (!filters) {
            return data;
        }

        let res = data;
        
        Object.keys(filters).forEach(field => {
            console.log(field);
            const filter = filters[field];
            res = res.filter(x => this._filterValue(x[field], filter));
        });
        return res;
    }

    private static _sorting(data: any[], sorting: ColumnSorting) {
        if (!sorting) {
            return data;
        }
    
        return data.sort((a, b) => {
            const aValue = sorting.direction === 1 ? a[sorting.column] : b[sorting.column];
            const bValue = sorting.direction === 1 ? b[sorting.column] : a[sorting.column];

            if (aValue > bValue) {
                return 1;
            } else if (aValue < bValue) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    private static _paging(data: any[], page: number, pageSize: number) {
        if (!pageSize) {
            return data;
        }

        const offset = (page - 1) * pageSize;
        return data.slice(offset, offset + pageSize);
    }

    public static get(data: any[]): TableValueProvider {
        return (args: TableValueProviderArguments) => {
            const sortedData = this._sorting(data, args.sotring);
            const filteredData = this._filterData(sortedData, args.filtration); 
            const pagedData = this._paging(filteredData, args.page, args.size);
            return of({
                total: filteredData.length,
                result: pagedData
            });
        };
    }
}