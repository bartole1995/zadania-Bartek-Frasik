import { useState, useEffect } from "react";
import moment from "moment";
import AppLocalStorage from "./AppLocalStorage";
import AppFirestoreStorage from "./AppFirestoreStorage";
import Notes from "./Notes";
import { INote } from "./interfaces";
import { FIREBASE } from "./config";

const { v4: uuidv4 } = require("uuid");
const appStorage = FIREBASE ? new AppFirestoreStorage() : new AppLocalStorage();

function App() {
  const [favorite, setFavorite] = useState<string[]>([]);
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    appStorage.getNotes().then((values) => setNotes(values));
    appStorage.getFavorite().then((values) => setFavorite(values));
  }, []);

  function toggleFavorite(id: string) {
    let newFavorite: string[] = [];
    if (favorite.includes(id)) newFavorite = favorite.filter((f) => f !== id);
    else newFavorite = [...favorite, id];
    appStorage
      .setFavorite(newFavorite)
      .then((isOk) =>
        isOk
          ? console.log("Favorites saved!")
          : console.error("Favorites error!")
      );
    setFavorite(newFavorite);
  }

  function deleteNote(id: string) {
    const newNotes = notes.filter((n) => n.id !== id);
    appStorage
      .setNotes(newNotes)
      .then((isOk) =>
        isOk ? console.log("Notes saved!") : console.error("Notes error!")
      );
    setNotes(newNotes);
    if (favorite.includes(id)) {
      const newFavorite = favorite.filter((f) => f !== id);
      appStorage
        .setFavorite(newFavorite)
        .then((isOk) =>
          isOk
            ? console.log("Favorites saved!")
            : console.error("Favorites error!")
        );
      setFavorite(newFavorite);
    }
  }

  function manageNote(
    id: string | null,
    title: string,
    text: string,
    color: string
  ) {
    if (id) {
      setNotes((currentNotes) => {
        const noteIndex = currentNotes.findIndex((n) => n.id === id);
        currentNotes[noteIndex].title = title;
        currentNotes[noteIndex].text = text;
        currentNotes[noteIndex].color = color;
        appStorage
          .setNotes(currentNotes)
          .then((isOk) =>
            isOk ? console.log("Notes saved!") : console.error("Notes error!")
          );
        return currentNotes;
      });
    } else {
      const note: INote = {
        id: uuidv4(),
        title,
        text,
        color,
        date: moment().format("DD.MM.YYYY, HH:mm"),
      };
      const newNotes = [note, ...notes];
      appStorage
        .setNotes(newNotes)
        .then((isOk) =>
          isOk ? console.log("Notes saved!") : console.error("Notes error!")
        );
      setNotes(newNotes);
    }
  }

  return (
    <Notes
      favorite={favorite}
      notes={notes}
      toggleFavorite={toggleFavorite}
      manageNote={manageNote}
      deleteNote={deleteNote}
    />
  );
}

export default App;
