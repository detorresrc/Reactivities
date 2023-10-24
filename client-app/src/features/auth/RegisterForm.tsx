import TextInput from "@/app/common/form/TextInput"
import useUserStore from "@/store/features/user"
import { ErrorMessage, Form, Formik } from "formik"
import { Button, Header } from "semantic-ui-react"
import * as Yup from 'yup'
import ValidationError from "../errors/ValidationError"

const RegisterForm = () => {
  const { register } = useUserStore();

  return (
    <Formik
      initialValues={{
        displayName : '',
        username    : '',
        email       : '',
        password    : '',
        error       : null
      }}
      validationSchema={Yup.object({
        displayName : Yup.string().required(),
        username    : Yup.string().required(),
        email       : Yup.string().required(),
        password    : Yup.string().required(),
      })}
      onSubmit={(values, {setErrors}) => register(values).catch(error => {
        console.log({error})
        setErrors({error});
      })}
      >
        {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <Header as="h2" content="Register to Reactivities" color="teal" textAlign="center"/>
            <TextInput placeholder="Display Name" name="displayName" />
            <TextInput placeholder="Username" name="username" />
            <TextInput placeholder="Email" name="email" />
            <TextInput placeholder="Password" name="password" type="password" />

            <ErrorMessage name="error" render={() => 
              <ValidationError errors={errors.error as unknown as string[]}/>
            }/>
            
            <Button disabled={!isValid || !dirty || isSubmitting} fluid loading={isSubmitting} positive content="Register" type="submit" />
          </Form>
        )}
    </Formik>
  )
}

export default RegisterForm