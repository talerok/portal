import { Component, OnInit } from '@angular/core';
import { TableColumn } from './common/table/models/table-column';
import { LocalValueProviderFactory } from './common/table/valueProviders/local-value-provider-factory';

class Test {
    constructor(public readonly name: string, public readonly description: number) { }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    public readonly val = LocalValueProviderFactory.get(this._generateFakeData(100));
    public readonly columns: TableColumn[] = [
        new TableColumn('Имя', 'name', null, null, true),
        new TableColumn('Описание', 'description', null, null, true)
    ];

    private _generateFakeData(count: number) {
        const res = [];
        for(let i = 0; i < count; i++) {
            res.push(new Test(`Имя ${i}`, i*i))
        }
        return res;
    }

    ngOnInit() {

    }

}
