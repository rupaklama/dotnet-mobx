import { observer } from "mobx-react-lite";

import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

const HomePage = () => {
  const { userStore } = useStore();
  const { isLoggedIn } = userStore;

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image size="massive" src="/assets/logo.png" alt="logo" style={{ marginBottom: 12 }} />
          Reactivities
        </Header>

        {isLoggedIn ? (
          <>
            {" "}
            <Header as="h2" inverted content="welcome to Reactivities" />
            <Button as={Link} to="/activities" size="huge" inverted content="Go to Activities!" />
          </>
        ) : (
          <Button as={Link} to="/login" size="huge" inverted content="Login!" />
        )}
      </Container>
    </Segment>
  );
};

export default observer(HomePage);
