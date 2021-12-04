import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Header, Label, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";

import { useStore } from "../../../app/stores/store";
import Loading from "../../../app/layout/Loading";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";

import "./ActivityForm.css";
import SelectInput from "./SelectInput";
import { categoryOptions } from "../common/categoryOptions";
import DateInput from "./DateInput";
import { Activity } from "../../../app/models/activity";

const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const { createActivity, updateActivity, isLoading, isLoadingInitial, loadActivity } = activityStore;

  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: "",
  });
  // const { title, category, description, date, city, venue } = activity;

  // if id, get activity from store
  useEffect(() => {
    // activity! - overriding typescript as we know what we are doing,
    // adding '!' turns of the typescript errors on the given value
    if (id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity]);

  // validating using Yup
  const validationSchema = Yup.object({
    // adding properties from our form here to validate
    title: Yup.string().required("title is required"),
    description: Yup.string().required("description is required"),
    category: Yup.string().required("category is required"),
    date: Yup.string().required("date is required").nullable(),
    city: Yup.string().required("city is required"),
    venue: Yup.string().required("venue is required"),
  });

  const handleFormSubmit = (activity: Activity) => {
    // create activity
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      // update activity
      updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  };

  if (isLoadingInitial) return <Loading />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={activity}
        onSubmit={values => handleFormSubmit(values)}
      >
        {/* render props pattern to render our form with formik */}
        {({
          values: { title, category, description, date, city, venue },
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
        }) => (
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group widths="equal" className="">
              <Form.Input placeholder="Title" value={title} name="title" onChange={handleChange} />
              <ErrorMessage name="title" render={err => <Label basic color="red" content={err} />} />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.TextArea
                placeholder="Description"
                value={description}
                name="description"
                onChange={handleChange}
              />
              <ErrorMessage name="description" render={err => <Label basic color="red" content={err} />} />
            </Form.Group>

            <Form.Group widths="equal">
              <SelectInput options={categoryOptions} name="category" placeholder="Category" />
            </Form.Group>

            <Form.Group widths="equal">
              <DateInput
                placeholderText="Date"
                name="date"
                showTimeSelect
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                onChange={handleChange}
              />
            </Form.Group>

            <Header content="Location Details" sub color="teal" />
            <Form.Group widths="equal">
              <Form.Input placeholder="City" value={city} name="city" onChange={handleChange} />
              <ErrorMessage name="city" render={err => <Label basic color="red" content={err} />} />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Input placeholder="Venue" value={venue} name="venue" onChange={handleChange} />
              <ErrorMessage name="venue" render={err => <Label basic color="red" content={err} />} />
            </Form.Group>

            <Button
              disabled={isSubmitting || !isValid}
              loading={isLoading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
