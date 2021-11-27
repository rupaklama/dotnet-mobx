import React, { useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

import { useStore } from "../../../app/stores/store";

const ActivityForm = () => {
  const { activityStore } = useStore();
  const { selectedActivity, closeForm, createActivity, updateActivity, isLoading } = activityStore;

  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  };

  const [activity, setActivity] = useState(initialState);
  const { title, category, description, date, city, venue } = activity;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    activity.id ? updateActivity(activity) : createActivity(activity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete='off'>
        <Form.Input placeholder='Title' value={title} name='title' onChange={handleInputChange} />
        <Form.TextArea
          placeholder='Description'
          value={description}
          name='description'
          onChange={handleInputChange}
        />
        <Form.Input placeholder='Category' value={category} name='category' onChange={handleInputChange} />
        <Form.Input type='date' placeholder='Date' value={date} name='date' onChange={handleInputChange} />
        <Form.Input placeholder='City' value={city} name='city' onChange={handleInputChange} />
        <Form.Input placeholder='Venue' value={venue} name='venue' onChange={handleInputChange} />

        <Button loading={isLoading} floated='right' positive type='submit' content='Submit' />
        <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
