import { useState } from "react";
import "./App.css";
import "./style.scss";
import { useForm } from "antd/lib/form/Form";
import { Space, Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Note from "./Note";
import NoteForm from "./NoteForm";
import { INote, INoteFormParams } from "./interfaces";

const { confirm } = Modal;

type NotesProps = {
  favorite: string[];
  notes: INote[];
  toggleFavorite: (id: string) => void;
  deleteNote: (id: string) => void;
  manageNote: (
    id: string | null,
    title: string,
    text: string,
    color: string
  ) => void;
};

function Notes(props: NotesProps) {
  const { notes, favorite, toggleFavorite, deleteNote, manageNote } = props;
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [noteIdToEdit, setNoteIdToEdit] = useState<string | null>(null);
  const [noteFormInstance] = useForm();

  function onFinish(params: INoteFormParams) {
    const { title, text, color } = params;
    manageNote(noteIdToEdit, title, text, color);
    if (noteIdToEdit) setNoteIdToEdit(null);
    setFormVisible(false);
    noteFormInstance.resetFields();
  }

  const otherArr: JSX.Element[] = [];
  const favoriteArr: JSX.Element[] = [];

  notes.forEach((n) => {
    const isFavorite = favorite.includes(n.id);
    const card = (
      <Note
        key={n.id}
        {...n}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(n.id)}
        onEdit={() => {
          setNoteIdToEdit(n.id);
          noteFormInstance.setFieldsValue(n);
          setFormVisible(true);
        }}
        onDelete={() =>
          confirm({
            title: "Uwaga!",
            icon: <ExclamationCircleOutlined />,
            content: "Czy na pewno chcesz usunąć notatkę?",
            okText: "Tak",
            okType: "danger",
            cancelText: "Nie",
            onOk() {
              deleteNote(n.id);
            },
          })
        }
      />
    );
    if (isFavorite) favoriteArr.push(card);
    else otherArr.push(card);
  });

  return (
    <Space className="notes" direction="vertical" align="center">
      <h1>Notekeep</h1>
      <Button
        shape="round"
        type="primary"
        size="large"
        onClick={() => setFormVisible(true)}
      >
        Dodaj notatkę
      </Button>
      <Space className="notes-space" wrap={true} align="center">
        {favoriteArr}
      </Space>
      <Space className="notes-space" wrap={true} align="center">
        {otherArr}
      </Space>
      <NoteForm
        form={noteFormInstance}
        visible={formVisible}
        isEdit={!!noteIdToEdit}
        onCancel={() => setFormVisible(false)}
        onFinish={onFinish}
      />
    </Space>
  );
}

export default Notes;
