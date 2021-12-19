import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Formik } from "formik";

import { Button, Form, Header } from "semantic-ui-react";
import * as Yup from "yup";

import { useStore } from "../../app/stores/store";
import { UserFormValues } from "../../app/models/user";

const LoginForm = () => {
  const { userStore } = useStore();

  const [formData] = useState({
    email: "",
    password: "",
  });

  const [isError, setIsErrors] = useState(false);

  // validating using Yup
  const validationSchema = Yup.object({
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  const handleFormSubmit = (data: UserFormValues) => {
    userStore.login(data).catch(() => setIsErrors(true));
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={formData}
      onSubmit={values => handleFormSubmit(values)}
    >
      {({ values: { email, password }, handleChange, handleSubmit, isValid, dirty }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <Header as="h2" content="Login to KamPostEvents" color="teal" textAlign="center" />

          <Form.Group widths="equal">
            <Form.Input placeholder="Email" name="email" value={email} onChange={handleChange} />
            {/* <ErrorMessage name="email" render={err => <Label basic color="red" content={err} />} /> */}
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              placeholder="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
            />
            {/* <ErrorMessage name="password" render={err => <Label basic color="red" content={err} />} /> */}
          </Form.Group>

          {isError && (
            <p style={{ color: "red", marginBottom: "15px", marginTop: "1px" }}>Invalid email or password</p>
          )}

          <Button positive content="Login" type="submit" fluid disabled={!isValid || !dirty} />
        </Form>
      )}
    </Formik>
  );
};

export default observer(LoginForm);
