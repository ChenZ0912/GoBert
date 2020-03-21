import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import { useMutation } from '@apollo/react-hooks';
//import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup';

function VoteButton({ user, post: { ratingID, upvotes, downvotes } }) {
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

  function likeRate () { console.log("liked"); }
  // const [likeRate] = useMutation(LIKE_POST_MUTATION, {
  //   variables: { postId: id }
  // });

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
    <Button as="div" labelPosition="right" onClick={likeRate}>
      <MyPopup content={up ? 'Undo' : 'Agree'}>{upButton}</MyPopup>
      <Label basic color="violet" pointing="left">{upCount}</Label>
    </Button>
    <Button as="div" labelPosition="right" onClick={likeRate}>
      <MyPopup content={down ? 'Undo' : 'Disagree'}>{downButton}</MyPopup>
      <Label basic color="violet" pointing="left">{downCount}</Label>
    </Button>
    </div>
  );
}

// const LIKE_POST_MUTATION = gql`
//   mutation likePost($ratingId: ID!) {
//     likePost(postId: $postId) {
//       id
//       likes {
//         id
//         username
//       }
//     }
//   }
// `;

export default VoteButton;
