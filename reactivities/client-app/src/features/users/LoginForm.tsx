import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ErrorMessage, Formik } from "formik";

import { Button, Form, Label } from "semantic-ui-react";
import * as Yup from "yup";

import { useStore } from "../../app/stores/store";
import { UserFormValues } from "../../app/models/user";

const LoginForm = () => {
  const { userStore } = useStore();

  const [formData] = useState({
    email: "",
    password: "",
  });

  // validating using Yup
  const validationSchema = Yup.object({
    email: Yup.string().required("email is required"),
    password: Yup.string().required("password is required"),
  });

  const handleFormSubmit = (data: UserFormValues) => {
    userStore.login(data);
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={formData}
      onSubmit={values => handleFormSubmit(values)}
    >
      {({ values: { email, password }, handleChange, handleSubmit, isSubmitting }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
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

          <Button positive content="Login" type="submit" fluid loading={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};

export default observer(LoginForm);
