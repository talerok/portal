

export enum ColumnFiltrationType {
    EQ = 0,
    BT = 1,
    ME = 2,
    LE = 3
}

export interface ColumnFiltration {
    value: any;
    type: ColumnFiltrationType;
}