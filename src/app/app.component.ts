import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TableColumn } from '@common/components/table/models/table-column';


class Test {
	constructor(public readonly name: string, public readonly id: number) { }
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

	@ViewChild('inputFilterTpl', { static: true }) inputFilterTpl: TemplateRef<any>;
	@ViewChild('selectFilterTpl', { static: true }) selectFilterTpl: TemplateRef<any>;

	public val = this._generateFakeData(1000);
	public filterOptions = this.val.filter(x => x.id % 10 === 0).map(x => ({label: `filter ${x.name}`, value: x.name}));

	public columns: TableColumn[];

	public contextMenu = null;

	private _generateFakeData(count: number) {
		const res = [];
		for(let i = 0; i < count; i++) {
			res.push(new Test(`Имя ${i*i}`, i))
		}
		return res;
	}

	public testClick() {
		this.val = this._generateFakeData(20);
	}

	ngOnInit() {
		this.columns = [
			new TableColumn('Имя', 'name', null, this.selectFilterTpl, true),
			new TableColumn('Id', 'id', null, this.inputFilterTpl, true)
		];
	}

}
