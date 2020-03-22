import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Confirm, Label, Icon } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';

function VoteButton({ id, upvotes, downvotes, username }) {
  const { user } = useContext(AuthContext);

  const upCount = upvotes.length;
  const [up, setUp] = useState(false);
  useEffect(() => {
    if (user && upvotes.find((name) => name === user.username)) {
      setUp(true);
    } else setUp(false);
  }, [user, upvotes]);
  
  const [down, setDown] = useState(false);
  const downCount = downvotes.length;
  useEffect(() => {
    if (user && downvotes.find((name) => name === user.username)) {
      setDown(true);
    } else setDown(false);
  }, [user, downvotes]);

  const upButton = user ? (
    up ? (
      <Button color="violet">
        <Icon name="thumbs up" />
      </Button>
    ) : (
      <Button color="violet" basic>
        <Icon name="thumbs up" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="violet" basic>
      <Icon name="thumbs up" />
    </Button>
  );

  const downButton = user ? (
    down ? (
      <Button color="violet">
        <Icon name="thumbs down" />
      </Button>
    ) : (
      <Button color="violet" basic>
        <Icon name="thumbs down" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="violet" basic>
      <Icon name="thumbs down" />
    </Button>
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRate] = useMutation(DELETE_RATE_MUTATION, {
    update() {
      setConfirmOpen(false);
      window.history.go(0);
    },
    variables: { id: id }
  });

  const [likeRate] = useMutation(UP_RATE_MUTATION, {
    update() {
      window.history.go(0);
    },
    variables: { id: id }
  });

  const [dislikeRate] = useMutation(DOWN_RATE_MUTATION, {
    update() {
      window.history.go(0);
    },
    variables: { id: id }
  });
  
  return (
    <div>
    <Button as="div" labelPosition="right" onClick={likeRate}>
      <MyPopup content={up ? 'Undo' : 'Agree'}>{upButton}</MyPopup>
      <Label basic color="violet" pointing="left">{upCount}</Label>
    </Button>
    <Button as="div" labelPosition="right" onClick={dislikeRate}>
      <MyPopup content={down ? 'Undo' : 'Disagree'}>{downButton}</MyPopup>
      <Label basic color="violet" pointing="left">{downCount}</Label>
    </Button>
    {user && user.username === username &&
      <>
      <MyPopup content='Delete'>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteRate}
      />
      </>
    }
    </div>
  );
}

const DELETE_RATE_MUTATION = gql`
  mutation deleteRate($id: ID!) {
    deleteRate(rateId: $id)
  }
`;

const UP_RATE_MUTATION = gql`
  mutation upvote($id: ID!) {
    upvote(rateId: $id)
  }
`;

const DOWN_RATE_MUTATION = gql`
  mutation downvote($id: ID!) {
    downvote(rateId: $id)
  }
`;

export default VoteButton;
