import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TableColumn } from './common/table/models/table-column';

class Test {
    constructor(public readonly name: string, public readonly description: number) { }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    @ViewChild('inputFilterTpl', { static: true }) inputFilterTpl: TemplateRef<any>;

    public readonly val = this._generateFakeData(1000);
    public columns: TableColumn[];

    private _generateFakeData(count: number) {
        const res = [];
        for(let i = 0; i < count; i++) {
            res.push(new Test(`Имя ${i}`, i*i))
        }
        return res;
    }

    ngOnInit() {
        this.columns = [
            new TableColumn('Имя', 'name', null, this.inputFilterTpl, true),
            new TableColumn('Описание', 'description', null, null, true)
        ];
    }

}
