import React, { useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";

import { Activity } from "../../../app/models/activity";

interface Props {
  closeForm(): void;
  activity: Activity | undefined;
  createOrEdit(activity: Activity): void;
}

const ActivityForm: React.FC<Props> = ({ closeForm, activity: selectedActivity, createOrEdit }) => {
  const initialState = selectedActivity ?? {
    id: uuid(),
    title: " ",
    category: " ",
    description: " ",
    date: " ",
    city: " ",
    venue: " ",
  };

  const [activity, setActivity] = useState(initialState);
  const { title, category, description, date, city, venue } = activity;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrEdit(activity);
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
        <Form.Input placeholder='Date' value={date} name='date' onChange={handleInputChange} />
        <Form.Input placeholder='City' value={city} name='city' onChange={handleInputChange} />
        <Form.Input placeholder='Venue' value={venue} name='venue' onChange={handleInputChange} />

        <Button floated='right' positive type='submit' content='Submit' />
        <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
