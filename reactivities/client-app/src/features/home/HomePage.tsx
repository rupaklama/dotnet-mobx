import { observer } from "mobx-react-lite";

import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

const HomePage = () => {
  const { userStore, modalStore } = useStore();
  const { isLoggedIn } = userStore;
  const { openModal } = modalStore;

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image size="massive" src="/512.png" alt="logo" style={{ marginBottom: 12 }} />
          Jobs, Rooms, Events and more...
        </Header>

        {isLoggedIn ? (
          <>
            <Header as="h2" inverted content="Welcome to Kam Post Events!" />
            <Button as={Link} to="/activities" size="huge" inverted content="Go to members Posts" />
          </>
        ) : (
          <>
            <Button onClick={() => openModal(<LoginForm />)} size="huge" inverted content="Login!" />
            <Button onClick={() => openModal(<RegisterForm />)} size="huge" inverted content="Register!" />
          </>
        )}
      </Container>
    </Segment>
  );
};

export default observer(HomePage);
