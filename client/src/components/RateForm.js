import React, { useContext } from 'react';
import { Button, Form, Grid, Select } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

var season = "";
const options = [
    { key: 1, text: '1', value: 1.0 },
    { key: 2, text: '2', value: 2.0 },
    { key: 3, text: '3', value: 3.0 },
    { key: 4, text: '4', value: 4.0 },
    { key: 5, text: '5', value: 5.0 },
]

function RateForm({
    rateSummary: { professor, courseID, courseTitle }
  }) {

  const { values, onChange, onSubmit } = useForm(createRateCallback, {
    courseID: {courseID},
    courseTitle: {courseTitle},
    courseScore: 0,
    professor: {professor},
    professorScore: 0,
    term: "",
    anonymity: false,
    comment: ""    
  });

  const { user } = useContext(AuthContext);
  const [createRate, { error }] = useMutation(CREATE_RATE_MUTATION, {
    update(proxy, result) {
    //   const data = proxy.readQuery({
    //     query: FETCH_POSTS_QUERY
    //   });
    //   data.getPosts = [result.data.createPost, ...data.getPosts];
    //   proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
    //   values.body = '';
    },
    variables: values
  });

  function handleProf (e, { value }) { values.professorScore = value; }
  function handleCourse (e, { value }) { values.courseScore = value; }
  function handleTerm (e, { value }) { season = value; }

  function createRateCallback() {
    if (values.courseScore !== 0 && values.profScore !== 0 && season !== "") {
        values.term = season + " " + values.term;
        createRate();
    }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
          <Grid columns='equal'>
              <Grid.Column>
                <Form.Field
                    compact
                    required
                    control={Select}
                    label='Professor Score:'
                    options={options}
                    onChange={handleProf}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Field
                    compact
                    required
                    control={Select}
                    label='Course Score:'
                    options={options}
                    onChange={handleCourse}
                />
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
                    label='Year:'
                    placeholder="2020"
                    onChange={onChange}
                    value={values.year}
                    error={error ? true : false}
                />
              </Grid.Column>
          </Grid>
        
        <Form.Field required>
          <label><br/>Share your experience with us!</label>
          <Form.Input
            required
            name="comment"
            placeholder="This course is ..."
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="violet" fluid>
            Submit
          </Button>
        </Form.Field>
      </Form>
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
      RateInput: {
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
        createdAt
    }
  }
`;

export default RateForm;
