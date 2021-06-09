import "./style.scss";
import { Card, Button } from "antd";
import {
  EditOutlined,
  StarOutlined,
  DeleteOutlined,
  StarFilled,
  TagFilled,
} from "@ant-design/icons";

type NoteProps = {
  id: string;
  title: string;
  text: string;
  color: string;
  date: string;
  isFavorite: boolean;
  onToggleFavorite: Function;
  onEdit: Function;
  onDelete: Function;
};

function Note(props: NoteProps) {
  const {
    id,
    title,
    text,
    color,
    date,
    isFavorite,
    onToggleFavorite,
    onEdit,
    onDelete,
  } = props;
  const starClass = isFavorite ? "favorite-star" : undefined;
  const favoriteIcon = isFavorite ? <StarFilled /> : <StarOutlined />;

  return (
    <Card
      key={id}
      className="note"
      title={
        <div className="note-title">
          {title}
          <TagFilled className='note-title-icon' style={{ color }} />
        </div>
      }
      bordered
      style={{
        borderColor: color,
      }}
      actions={[
        <Button
          className={starClass}
          icon={favoriteIcon}
          onClick={() => onToggleFavorite()}
          key="favorite"
        />,
        <Button key="edit" icon={<EditOutlined />} onClick={() => onEdit()} />,
        <Button
          danger
          icon={<DeleteOutlined />}
          key="delete"
          onClick={() => onDelete()}
        />,
      ]}
    >
      <p>{text}</p>
      <div className="note-date">Utworzono: {date}</div>
    </Card>
  );
}

export default Note;
