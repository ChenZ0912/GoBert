import React, { useContext } from 'react';
import { Grid, Divider } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import VoteButton from './VoteButton';
//import DeleteButton from './DeleteButton';
//import MyPopup from '../util/MyPopup';

function Rating({
  rating: {username, anonymity, courseID, courseTitle, term, courseScore,
    professor, professorScore, comment, upvotes, downvotes}
}) {
  const { user } = useContext(AuthContext);
  const ratingID = "";

  return (
    <Grid divided>
      <Grid.Row stretched>
        <Grid.Column width={4}>
          <span>Course Score:<br/><b>{courseScore}/5</b><br/><br/>
          Professor Score:<br/><b>{professorScore}/5</b></span>
        </Grid.Column>
        <Grid.Column width={8}>
          {anonymity ? 
            <h3>[{term}] Anonymous</h3> : 
            <h3>[{term}] {username}</h3>}
          <p>{comment}</p>
          <VoteButton user={user} post={{ ratingID, upvotes, downvotes }} />
        </Grid.Column>
      </Grid.Row>
      <Divider/>
    </Grid>
  );
}

export default Rating;
