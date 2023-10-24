import { useField } from "formik";
import { FC } from "react";
import { Form, Label } from "semantic-ui-react";

type Props = {
  placeholder: string;
  name: string;
  label?: string;
  type?:string;
}

const TextInput:FC<Props> = ({name, label, placeholder, type='text'}) => {
  const [field, meta] = useField(name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label htmlFor={name}>{label}</label>
      <input {...field} placeholder={placeholder} type={type}/>
      {meta.touched && meta.error ? (
        <Label basic color='red'>{meta.error}</Label>
      ) : null}
    </Form.Field>
  )
}

export default TextInput