export interface INote {
  id: string;
  title: string;
  text: string;
  color: string;
  date: string;
}

export interface INoteFormParams {
  title: string;
  text: string;
  color: string;
}

export interface IAppStorage {
  getNotes: () => Promise<any[]>;
  getFavorite: () => Promise<any[]>;
  setNotes: (notes: INote[]) => Promise<boolean>;
  setFavorite: (favorite: string[]) => Promise<boolean>;
}
