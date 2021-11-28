import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";

import { useStore } from "../../../app/stores/store";
import Loading from "../../../app/layout/Loading";

const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const { createActivity, updateActivity, isLoading, isLoadingInitial, loadActivity } = activityStore;

  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });
  const { title, category, description, date, city, venue } = activity;

  // if id, get activity from store
  useEffect(() => {
    // activity! - overriding typescript as we know what we are doing,
    // adding '!' turns of the typescript errors on the given value
    if (id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setActivity({ ...activity, [name]: value });
  };

  if (isLoadingInitial) return <Loading />;

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
        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
