import { IAppStorage, INote } from "./interfaces";
import firebase from "firebase/app";

class AppFirestoreStorage implements IAppStorage {
  async getNotes() {
    try {
      const notesRef = firebase.firestore().collection("app").doc("notes");
      const snap = await notesRef.get();
      if (snap.exists) {
        const notes = snap.data();
        if (notes && notes.data) {
          return JSON.parse(notes.data);
        }
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async getFavorite() {
    try {
      const favoriteRef = firebase
        .firestore()
        .collection("app")
        .doc("favorite");
      const snap = await favoriteRef.get();
      if (snap.exists) {
        const favorite = snap.data();
        if (favorite && favorite.data) {
          return JSON.parse(favorite.data);
        }
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async setNotes(notes: INote[]) {
    try {
      const notesRef = firebase.firestore().collection("app").doc("notes");
      await notesRef.set({ data: JSON.stringify(notes) });
      return true;
    } catch (error) {
      return false;
    }
  }

  async setFavorite(favorite: string[]) {
    try {
      const favoriteRef = firebase
        .firestore()
        .collection("app")
        .doc("favorite");
      await favoriteRef.set({ data: JSON.stringify(favorite) });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default AppFirestoreStorage;
