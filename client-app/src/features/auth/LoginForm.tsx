import TextInput from "@/app/common/form/TextInput"
import useUserStore from "@/store/features/user"
import { ErrorMessage, Form, Formik } from "formik"
import { Button, Header, Label } from "semantic-ui-react"

const LoginForm = () => {
  const { login } = useUserStore();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        error: null
      }}
      onSubmit={(values, {setErrors}) => login(values).catch(_ => {
        setErrors({error: 'Invalid email or password'});
      })}
      >
        {({handleSubmit, isSubmitting, errors}) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <Header as="h2" content="Login to Reactivities" color="teal" textAlign="center"/>
            <TextInput placeholder="Email" name="email" />
            <TextInput placeholder="Password" name="password" type="password" />

            <ErrorMessage name="error" render={() => 
              <Label style={{marginBottom: '10px'}} basic color='red'content={errors.error}/>} />
            
            <Button fluid loading={isSubmitting} positive content="Login" type="submit" />
          </Form>
        )}
    </Formik>
  )
}

export default LoginForm