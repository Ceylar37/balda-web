export enum CellType {
  Empty = 'empty',
  Letter = 'letter',
  Possible = 'possible'
}

export type Cell =
  | {
      value: string;
      type: CellType.Letter;
    }
  | {
      value?: never;
      type: CellType.Empty | CellType.Possible;
    };
