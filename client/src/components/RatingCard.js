import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Checkbox, Confirm, Divider, Grid } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import MyPopup from '../util/MyPopup';
import RateForm from './RateForm';
import VoteButton from './VoteButton';

function RatingCard({
  course_id,
  rateSummary: { professor, courseID, courseTitle, avgProfScore, avgCourseScore, ratings }
}) {
  
  const {user} = useContext(AuthContext);
  const [ askToRate, setAsk ] = useState(true);
  const [ values, setVal ] = useState({
    avgProfScore: avgProfScore,
    avgCourseScore: avgCourseScore,
    ratings: ratings
  });
  
  // Show ratings
  const [ showRating, setShow ] = useState(false);
  function handleRatings(e, {checked}) { setShow(checked); }

  // Ask user to rate if not rated
  useEffect(() => {
    if (user && (ratings).find((rating) => rating.username === user.username)) {
      setAsk(false);
    }
  }, [user, ratings]);

  // Delete a rating
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRate] = useMutation(DELETE_RATE_MUTATION, {
    update(cache, mutationResult) {
      if (mutationResult.data["deleteRate"]) {
        var result = mutationResult.data["deleteRate"];

        values.ratings = result["ratings"];
        values.avgProfScore = result["avgProfScore"];
        values.avgCourseScore = result["avgCourseScore"];
        (user && values.ratings.find((rating) => rating.username === user.username)) ?
          setAsk(false) : setAsk(true);
        setVal(values);
      }
    },
  });

  return (
    <Card fluid color='violet'>
      <Card.Content>
      <Grid>
        <Grid.Column width={11}>
          { course_id ? 
            <a style={{color: "black"}} href={"/rateCourse/"+course_id}>
              <h3>{courseID} {courseTitle}</h3></a>: 
            <a style={{color: "black"}} href={"/rateProf/"+professor}> <h3>{professor}</h3> </a> 
          }
          <span><br/>[ Number of Ratings: {values.ratings.length} ]</span>
        </Grid.Column>
        <Grid.Column width={5}>
          <span>Overall Course Score: {values.avgCourseScore}/5<br/>
          Overall Professor Score: {values.avgProfScore}/5<br/><br/></span>
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
        { values.ratings.map((rating, index) => (
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
          <RateForm  setAsk={setAsk} setVals={setVal}
            formInput = {{professor, courseID, courseTitle, vals: values}}/>
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
      avgProfScore
      avgCourseScore
      ratings{
        username
        anonymity
        term
        courseScore
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
