import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';

function VoteButton({ id, upvotes, downvotes, username }) {
  const { user } = useContext(AuthContext);
  const [upvote, setUpvote] = useState(upvotes);
  const [up, setUp] = useState(false);
  const [downvote, setDownvote] = useState(downvotes);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (user && upvotes.find((name) => name === user.username)) setUp(true);
    if (user && downvotes.find((name) => name === user.username)) setDown(true);
  }, [user, upvotes, downvotes]);
  
  function changeLike(newUpvote, newDownvote) {
    if (user && newUpvote.find((name) => name === user.username)) {
      setUp(true);
    } else setUp(false);
    if (user && newDownvote.find((name) => name === user.username)) {
      setDown(true);
    } else setDown(false);
    setUpvote(newUpvote);
    setDownvote(newDownvote);
  }

  const [likeRate] = useMutation(UP_RATE_MUTATION, {
    update(cache, mutationResult) {
      if (mutationResult.data["upvote"]) {
        changeLike(mutationResult.data["upvote"]["upvotes"], 
        mutationResult.data["upvote"]["downvotes"]);
      }
    },
    variables: { id: id }
  });

  const [dislikeRate] = useMutation(DOWN_RATE_MUTATION, {
    update(cache, mutationResult) {
      if (mutationResult.data["downvote"]) {
        changeLike(mutationResult.data["downvote"]["upvotes"], 
        mutationResult.data["downvote"]["downvotes"]);
      }
    },
    variables: { id: id }
  });

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
  
  return (
    <div>
    <Button as="div" labelPosition="right" onClick={user && likeRate}>
      <MyPopup content={up ? 'Undo' : 'Agree'}>{upButton}</MyPopup>
      <Label basic color="violet" pointing="left">{upvote.length}</Label>
    </Button>
    <Button as="div" labelPosition="right" onClick={user && dislikeRate}>
      <MyPopup content={down ? 'Undo' : 'Disagree'}>{downButton}</MyPopup>
      <Label basic color="violet" pointing="left">{downvote.length}</Label>
    </Button>
    </div>
  );
}

const UP_RATE_MUTATION = gql`
  mutation upvote($id: ID!) {
    upvote(rateId: $id) {
      upvotes
      downvotes
    }
  }
`;

const DOWN_RATE_MUTATION = gql`
  mutation downvote($id: ID!) {
    downvote(rateId: $id) {
      upvotes
      downvotes
    }
  }
`;

export default VoteButton;
