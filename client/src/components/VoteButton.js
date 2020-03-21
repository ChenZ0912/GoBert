import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Confirm, Label, Icon } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';

function VoteButton({ post: { id, upvotes, downvotes, username } }) {
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRate] = useMutation(DELETE_RATE_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      console.log(proxy);
      const pathname = window.location.pathname;
      window.location.pathname = pathname;
    },
    variables: { rateId: id }
  });
  
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
  mutation deleteRate($rateId: String!) {
    deleteRate(rateId: $rateId)
  }
`;

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
