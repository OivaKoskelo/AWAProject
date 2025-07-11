export interface CardType {
  id: string;
  header: string;
  content: string;
  color: string;
  createdAt: string,
  updatedAt: string,
  estimatedTime: string,
}

export interface ColumnType {
  id: string;
  name: string;
  cards: CardType[];
  color: string;
}

export interface Board {
  columns: ColumnType[];
}
