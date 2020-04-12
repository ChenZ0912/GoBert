import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Confirm, Divider, Grid } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';
import RateForm from './RateForm';
import VoteButton from './VoteButton';

function RatingCard({
  category,
  rateSummary: {professor, courseID, courseTitle,
    avgProfScore, avgCourseScore, numRate, ratings}
}) {

  const {user} = useContext(AuthContext);
  const [showRating, setShow] = useState(false);
  function handleRatings(e, {checked}) { setShow(checked); }

  const [ratingCollection, setCollection ] = useState(ratings);
  const [askToRate, setAskToRate] = useState(true);
  useEffect(() => {
    if (user && ratingCollection.find((rating) => rating.username === user.username)) {
      setAskToRate(false);
    } 
  }, [user, ratingCollection]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRate] = useMutation(DELETE_RATE_MUTATION, {
    update(cache, mutationResult) {
      if (mutationResult.data["deleteRate"]) {
        var newRatings = mutationResult.data["deleteRate"]["ratings"]
        if (user && newRatings.find((rating) => rating.username === user.username)) {
          setAskToRate(false);
        } else setAskToRate(true);
        setCollection(newRatings);
      }
    },
  });

  return (
    <Card fluid color='violet'>

      <Card.Content>
      <Grid>
        <Grid.Column floated='left' width={8}>
          {category === "professor" ? 
          <h3>{courseID} {courseTitle}</h3>:
          <h3>{professor}</h3>
          }
          <span><br/>[ Number of Ratings: {ratingCollection.length} ]</span>
        </Grid.Column>
        <Grid.Column floated='right' width={4}>
          <span>Overall Course Score: {avgCourseScore}/5<br/>
          Overall Professor Score: {avgProfScore}/5<br/><br/></span>
          <Checkbox
            label='SHOW RATINGS'
            onChange={handleRatings}
            slider
          />
        </Grid.Column>
      </Grid>
      </Card.Content>

      { showRating ?
      <Card.Content>
        { ratingCollection && ratingCollection.map((rating, index) => (
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
            {user && user.username === rating.username &&
            <Grid.Column width={2}>
              <MyPopup content='Delete'>
                <Button
                  className='center'
                  color="red"
                  icon="trash"
                  style={{ width: "60px" }}
                  onClick={() => setConfirmOpen(true)}
                />
              </MyPopup>
              <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={e => {
                  e.preventDefault();
                  setConfirmOpen(false);
                  deleteRate({variables: {id: rating._id}});
                }}
              />
            </Grid.Column>
            }
          </Grid.Row>
          <Divider/>
          </Grid>
        </dl> ))}
        {user && askToRate &&
          <RateForm rateSummary = {{professor, courseID, courseTitle, ratings: ratingCollection}} />
        }
      </Card.Content>
      : ( user && 
        <Card.Content>
          {askToRate ? 
            <span>Share your opinions by clicking on <b>SHOW RATINGS</b> (●'◡'●)</span>
            : <span>Check out the ratings!!! Click on <b>SHOW RATINGS</b> (●ˇ∀ˇ●)</span>}
        </Card.Content>
      )}

      {!user &&
        <Card.Content>
          <a href="/login">Please LOGIN to share your opinions (●'◡'●)</a>
        </Card.Content>
      }
    </Card>
  );
}

const DELETE_RATE_MUTATION = gql`
  mutation deleteRate($id: ID!) {
    deleteRate(rateId: $id) {
      ratings{
        username
        username
        anonymity
        courseID
        courseTitle
        term
        courseScore
        professor
        professorScore
        comment
        upvotes
        downvotes
        _id
      }
    }
  }
`;

export default RatingCard;
