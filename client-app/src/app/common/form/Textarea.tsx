import { useField } from "formik";
import { FC } from "react";
import { Form, Label } from "semantic-ui-react";

type Props = {
  placeholder: string;
  name: string;
  label?: string;
  rows: number;
}

const TextArea:FC<Props> = ({name, label, placeholder, rows}) => {
  const [field, meta] = useField(name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label htmlFor={name}>{label}</label>
      <textarea {...field} placeholder={placeholder} rows={rows}/>
      {meta.touched && meta.error ? (
        <Label basic color='red'>{meta.error}</Label>
      ) : null}
    </Form.Field>
  )
}

export default TextArea