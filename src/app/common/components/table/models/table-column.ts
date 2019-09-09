import { TemplateRef } from '@angular/core';

export type FuncTableProvider = (value: any, row: any) => any;

export class TableColumn {
	constructor(
		public readonly name: string,
		public readonly field: string,
		public readonly valueProvider: FuncTableProvider | TemplateRef<any>,
		public readonly filtration: TemplateRef<any>,
		public readonly sortable: boolean = false
	) {

	}
}
