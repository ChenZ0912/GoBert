import React from 'react';
import { Grid, Divider } from 'semantic-ui-react';

import VoteButton from './VoteButton';

function Rating({
  rating: {username, anonymity, term, courseScore,
    professorScore, comment, upvotes, downvotes, id}
}) {
  return (
    <Grid divided>
      <Grid.Row stretched>
        <Grid.Column width={4}>
          <span>Course Score:<br/><b>{courseScore}/5</b><br/><br/>
          Professor Score:<br/><b>{professorScore}/5</b></span>
        </Grid.Column>
        <Grid.Column width={10}>
          {anonymity ? 
            <h3>[{term}] Anonymous</h3> : 
            <h3>[{term}] {username}</h3>}
          <p>{comment}</p>
          <VoteButton post={{ id, upvotes, downvotes, username }} />
        </Grid.Column>
      </Grid.Row>
      <Divider/>
    </Grid>
  );
}

export default Rating;
