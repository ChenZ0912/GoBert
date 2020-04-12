import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, Rating, Select } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

var season = "";

function RateForm({
    rateSummary: { professor, courseID, courseTitle, ratings }
  }) {
  
  const {user} = useContext(AuthContext);
  const [showRating, setShow] = useState(false);
  useEffect(() => {
    if (user && ratings.find((rating) => rating.username === user.username)) {
      setShow(false);
    } else setShow(true);
  }, [user, ratings]);

  const { values, onChange, onSubmit } = useForm(createRateCallback, {
    courseID,
    courseTitle,
    courseScore: 0.0,
    professor,
    professorScore: 0.0,
    term: "",
    anonymity: false,
    comment: ""    
  });

  const [createRate, { error }] = useMutation(CREATE_RATE_MUTATION, {
      update() {
        window.history.go(0);
      },
      variables: values
    });

  function handleProf (e, { rating }) { values.professorScore = rating; }
  function handleCourse (e, { rating }) { values.courseScore = rating; }
  function handleTerm (e, { value }) { season = value; }

  function createRateCallback() {
    if (values.courseScore !== 0 && values.profScore !== 0 && season !== "") {
      values.term = season + " " + values.term;
      console.log(values)
      createRate();
    }
  }

  return (
    <>
    {showRating && (
      <Form onSubmit={onSubmit}>
        <Grid columns='equal'>
          <Grid.Column>
            <Form.Field required label='Professor Score:' style={{marginLeft: '5px'}}/>
            <Rating maxRating={5} icon='star' size="massive" onRate={handleProf}/>
          </Grid.Column>
          <Grid.Column>
            <Form.Field required label='Course Score:' style={{marginLeft: '5px'}}/>
            <Rating maxRating={5} icon='star' size="massive" onRate={handleCourse}/>
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              compact
              required
              control={Select}
              label='Term:'
              options={[
                  { key: 1, text: 'Spring', value: 'Spring' },
                  { key: 2, text: 'Fall', value: 'Fall' },
              ]}
              onChange={handleTerm}
            />
          </Grid.Column>
          <Grid.Column>
          <Form.Input
            required
            name="term"
            label="Year:"
            placeholder="2020"
            onChange={onChange}
            value={values.year}
            error={error ? true : false}
          />
          </Grid.Column>
        </Grid>
      
        <br/>
        <Form.Input
          required
          name="comment"
          placeholder="This course is ..."
          label="Share your experience with us!"
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type="submit" color="violet" fluid>
          Submit
        </Button>
      </Form>
    )}
    {error && (
      <div className="ui error message" style={{ marginBottom: 20 }}>
        <ul className="list">
          <li>{error.graphQLErrors[0] && error.graphQLErrors[0].message}</li>
        </ul>
      </div>
    )}
  </>
  );
}

const CREATE_RATE_MUTATION = gql`
  mutation postRate(
    $courseID: String!
    $courseTitle: String!
    $courseScore: Float!
    $professor: String!
    $professorScore: Float!
    $term: String!
    $anonymity: Boolean!
    $comment: String!
  ) {
    postRate(
      rateInput: {
        courseID: $courseID
        courseTitle: $courseTitle
        courseScore: $courseScore
        professor: $professor
        professorScore: $professorScore
        term: $term
        anonymity: $anonymity
        comment: $comment
      }
    ) {
      alreadyRate
      username
      courseID
      courseTitle
      courseScore
      professor
      professorScore
      term
      anonymity
      comment
    }
  }
`;

export default RateForm;
