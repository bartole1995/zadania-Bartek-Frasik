import React from "react";
import { Space, Input, Select, Form, Modal, FormInstance, Button } from "antd";
import "./style.scss";

const { TextArea } = Input;
const { Option } = Select;

type FormProps = {
  form: FormInstance;
  visible: boolean;
  isEdit: boolean;
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onFinish: (values: any) => void;
};

function NoteForm(props: FormProps) {
  const { form, visible, isEdit, onCancel, onFinish } = props;

  return (
    <Modal
      title={isEdit ? "Edycja notatki" : "Dodawanie notatki"}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Zapisz
        </Button>,
      ]}
    >
      <Form form={form} id="manage-note" name="basic" onFinish={onFinish}>
        <Form.Item
          label="Tytuł"
          name="title"
          rules={[{ required: true, message: "Należy uzupełnić tytuł!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Treść"
          name="text"
          rules={[{ required: true, message: "Należy uzupełnić treść!" }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Kolor"
          name="color"
          rules={[{ required: true, message: "Należy wybrać kolor!" }]}
        >
          <Select>
            <Option value="tomato">
              <Space>
                <div
                  className="form-option-square"
                  style={{ backgroundColor: "tomato" }}
                />
                Czerwony
              </Space>
            </Option>
            <Option value="cornflowerblue">
              <Space>
                <div
                  className="form-option-square"
                  style={{
                    backgroundColor: "cornflowerblue",
                  }}
                />
                Niebieski
              </Space>
            </Option>
            <Option value="gold">
              <Space>
                <div
                  className="form-option-square"
                  style={{ backgroundColor: "gold" }}
                />
                Żółty
              </Space>
            </Option>
            <Option value="mediumseagreen">
              <Space>
                <div
                  className="form-option-square"
                  style={{
                    backgroundColor: "mediumseagreen",
                  }}
                />
                Zielony
              </Space>
            </Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default NoteForm;
