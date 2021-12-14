import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ErrorMessage, Formik } from "formik";

import { Button, Form, Header, Label } from "semantic-ui-react";
import * as Yup from "yup";

import { useStore } from "../../app/stores/store";
import { UserFormValues } from "../../app/models/user";
import ValidationErrors from "../errors/ValidationErrors";

const RegisterForm = () => {
  const { userStore } = useStore();

  const [formData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState(null);

  // validating using Yup
  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  const handleFormSubmit = (data: UserFormValues) => {
    // .catch(err) - backend errors will be inside of 'err' param on throwing err
    userStore.register(data).catch(err => setErrors(err));
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={formData}
      onSubmit={values => handleFormSubmit(values)}
    >
      {({
        values: { displayName, username, email, password },
        handleChange,
        handleSubmit,
        isValid,
        dirty,
      }) => (
        <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
          <Header as="h2" content="Sign up to KamPost" color="teal" textAlign="center" />

          <Form.Group widths="equal">
            <Form.Input
              placeholder="Display Name"
              name="displayName"
              value={displayName}
              onChange={handleChange}
            />
            <ErrorMessage name="displayName" render={err => <Label basic color="red" content={err} />} />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input placeholder="Username" name="username" value={username} onChange={handleChange} />
            <ErrorMessage name="username" render={err => <Label basic color="red" content={err} />} />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input placeholder="Email" name="email" value={email} onChange={handleChange} />
            <ErrorMessage name="email" render={err => <Label basic color="red" content={err} />} />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Input
              placeholder="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
            />
            <ErrorMessage name="password" render={err => <Label basic color="red" content={err} />} />
          </Form.Group>

          {errors && <ValidationErrors errors={errors} />}

          <Button positive content="Register" type="submit" fluid disabled={!isValid || !dirty} />
        </Form>
      )}
    </Formik>
  );
};

export default observer(RegisterForm);
