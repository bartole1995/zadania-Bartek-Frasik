import { IAppStorage, INote } from "./interfaces";
import firebase from "firebase/app";

class AppLocalStorage implements IAppStorage {
  async getNotes() {
    try {
      const notes = localStorage.getItem("@userNotes");
      if (notes) return JSON.parse(notes);
    } catch (error) {
      return [];
    }
  }

  async getFavorite() {
    try {
      const favorite = localStorage.getItem("@userFavorite");
      if (favorite) return JSON.parse(favorite);
      return [];
    } catch (error) {
      return [];
    }
  }

  async setNotes(notes: INote[]) {
    try {
      localStorage.setItem("@userNotes", JSON.stringify(notes));
      return true;
    } catch (error) {
      return false;
    }
  }

  async setFavorite(favorite: string[]) {
    try {
      localStorage.setItem("@userFavorite", JSON.stringify(favorite));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default AppLocalStorage;
