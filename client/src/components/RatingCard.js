import React, {useState} from 'react';
import { Card, Checkbox, Divider, Grid } from 'semantic-ui-react';

import RateForm from './RateForm';
import VoteButton from './VoteButton';

function RatingCard({
  rateSummary: {professor, courseID, courseTitle,
    avgProfScore, avgCourseScore, numRate, ratings}
}) {

  const [showRating, setShow] = useState(false);
  function handleRatings(e, {checked}) { setShow(checked); }

  return (
    <Card fluid color='violet'>
      <Card.Content>
      <Grid>
        <Grid.Column floated='left' width={8}>
          <h3>{courseID} {courseTitle}<br/>{professor}</h3>
        </Grid.Column>
        <Grid.Column floated='right' width={4}>
          <p>Overall Course Score: {avgCourseScore}/5<br/>
          Overall Professor Score: {avgProfScore}/5</p>
          <Checkbox
            label='SHOW RATINGS'
            onChange={handleRatings}
            slider
          />
        </Grid.Column>
      </Grid>
      </Card.Content>
      {showRating && (
      <Card.Content>
        {ratings && ratings.map((rating, index) => (
        <dl key={index}>
        <Grid divided>
          <Grid.Row stretched>
            <Grid.Column width={4}>
              <span>Course Score:<br/><b>{rating.courseScore}/5</b><br/><br/>
              Professor Score:<br/><b>{rating.professorScore}/5</b></span>
            </Grid.Column>
            <Grid.Column width={10}>
              {rating.anonymity ? 
                <h3>[{rating.term}] Anonymous</h3> : 
                <h3>[{rating.term}] {rating.username}</h3>}
              <p>{rating.comment}</p>
              <VoteButton upvotes={rating.upvotes} downvotes={rating.downvotes} 
                          id = {rating._id} username={rating.username} />
            </Grid.Column>
          </Grid.Row>
          <Divider/>
          </Grid>
          </dl> ))}
          <RateForm rateSummary = {{professor, courseID, courseTitle, ratings}} />
        </Card.Content>
      )}
    </Card>
  );
}

export default RatingCard;
