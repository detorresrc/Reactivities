import { useField } from "formik";
import { FC } from "react";
import { Form, Label, Select } from "semantic-ui-react";

type Props = {
  name: string;
  label?: string;
  options: {
    text: string;
    value: string
  }[],
  placeholder: string
}

const SelectInput:FC<Props> = ({name, label, options, placeholder}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label htmlFor={name}>{label}</label>
      <Select
        clearable
        options={options}
        value={field.value || null}
        onChange={(_, d) => helpers.setValue(d.value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={placeholder}
      />
      {meta.touched && meta.error ? (
        <Label basic color='red'>{meta.error}</Label>
      ) : null}
    </Form.Field>
  )
}

export default SelectInput