import React, { useState } from 'react';
import { Button, Form, Grid, Rating, Select } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks'; 

function RateForm(
  {setAsk, setVals, formInput: { professor, courseID, courseTitle, vals}}
) {
  // Set up values for form
  const [error, setError] = useState();
  const [ values, setVal ] = useState({
    professor: professor,
    courseID: courseID,
    courseTitle: courseTitle,
    courseScore: 0.0,
    professorScore: 0.0,
    comment: "",
    term: "",
    year: 0,
    anonymity: false,
  })

  function onRate (e, { name, rating }) { 
    values[name]=rating;
    setVal(values); 
  }

  function onChange (e, { name, value }) { 
    values[name]=value;
    setVal(values); 
  }

  // A year is considered valid if it is within last 10 years
  const year = new Date().getFullYear() + 1;

  function onSubmit() {
    var errorTemp = "";
    if (values.courseScore === 0)
      errorTemp = "Please provide a course score.";
    else if (values.profScore === 0)
      errorTemp="Please provide a professor score.";
    else if (values.year < (year-10) || values.year > year)
      errorTemp="Please provide a valid year.";
    else if (values.term === "")
      errorTemp="Please select a term.";
    else if (values.comment === "")
      errorTemp="Please tell us about this course.";

    setError(errorTemp);
    if (errorTemp === "") {
      createRate({
        variables: {
          courseID: values.courseID,
          courseTitle: values.courseTitle,
          courseScore: values.courseScore,
          professor: values.professor,
          professorScore: values.professorScore,
          term: values.term + values.year,
          anonymity: values.anonymity,
          comment: values.comment
        }
      })
    }
  }

  const [createRate] = useMutation(CREATE_RATE_MUTATION, {
    update(cache, mutationResult) {
      if (mutationResult.data["postRate"]) {
        var results = mutationResult.data["postRate"];
        vals.ratings.push({
          username: results.username,
          courseScore: results.courseScore,
          professorScore: results.professorScore,
          anonymity: results.anonymity,
          comment: results.comment,
          upvotes: results.upvotes,
          downvotes: results.downvotes,
          term: results.term,
          _id: results.id
        });
        setVals(vals);
        setAsk(results.alreadyRate);
      }
    },
    onError(error) {
      if (error.graphQLErrors) 
        setError(error.graphQLErrors[0].message);
    },
    onCompleted() {
      //window.history.go(0);
    }
  });

  return (
    <div style={{margin: "0 5px 0 5px"}}>
    <Form onSubmit={onSubmit}>
      <Grid columns='equal'>
        <Grid.Column>
          <Form.Field required label='Course Score:'/>
          <Rating maxRating={5} icon='star' size="massive" 
            name="courseScore" onRate={onRate} />
        </Grid.Column>
        <Grid.Column>
          <Form.Field required label='Professor Score:'/>
          <Rating maxRating={5} icon='star' size="massive" 
            name="professorScore" onRate={onRate} />
        </Grid.Column>
        <Grid.Column>
          <Form.Field required label='Year:' style={{marginBottom: "0"}}/>
          <Form.Input
            name="year"
            type="number"
            placeholder="2020"
            onChange={onChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            required
            name="term"
            label="Term"
            control={Select}
            options={[
                { key: 0, text: 'Spring', value: 'Spring ' },
                { key: 1, text: 'Fall', value: 'Fall ' }
            ]}
            onChange={onChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            name="anonymity"
            label="Anonymous:"
            control={Select}
            options={[
                { key: 0, text: 'True', value: true },
                { key: 1, text: 'False', value: false }
            ]}
            defaultValue={values.anonymity}
            onChange={onChange}
          />
        </Grid.Column>
      </Grid><br/>
      
      <Form.Field required label='Share your experience with us!'/>
      <Form.Input
        name="comment"
        placeholder="This course is ..."
        onChange={onChange}
      />
      <Button type="submit" color="violet" fluid>Submit</Button>
    </Form>

    {error && (
      <div className="ui error message">
        <li>{error}</li>
      </div>
    )}

  </div>
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
      upvotes
      downvotes
      id
    }
  }
`;

export default RateForm;
