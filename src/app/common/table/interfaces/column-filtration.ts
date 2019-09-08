

export enum ColumnFiltrationType {
    EQ = 'EQ', // Equals
    IN = 'IN', // Between
    ME = 'ME', // More or Equal
    LE = 'LE', // Less or Equal
    CT = 'CT' // Contains
}

export interface ColumnFiltration {
    value: any;
    type: ColumnFiltrationType;
}