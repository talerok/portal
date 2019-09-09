import { Observable } from 'rxjs';
import { ColumnFiltration } from './column-filtration';

export enum ColumnSortingDirection {
	ASC = 1,
	DEC = -1
}

export interface ColumnSorting {
	column: string;
	direction: ColumnSortingDirection;
}

export interface TableValueProviderArguments {
	page: number;
	size: number;
	sotring: ColumnSorting;
	filtration: { [column: string]: ColumnFiltration; };
}

export interface TableValueProviderResponse {
	result: any[];
	total: number;
}

export type TableValueProvider = (args: TableValueProviderArguments) => Observable<TableValueProviderResponse>;
