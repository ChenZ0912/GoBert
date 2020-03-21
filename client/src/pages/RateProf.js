import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Card, Grid, Container, Transition } from 'semantic-ui-react';
import Rating from '../components/Rating';

function RateProf(props) {
  const name = props.match.params.name;

  const {
    loading,
    data: {getProfessorDetail : results}
  } = useQuery(FETCH_PROF_QUERY, {
    variables: {
      name
    }
  });

  var output = "No ratings availble /(ㄒoㄒ)/~~";
  if (results && results.rateSummary && results.rateSummary.length!==0) {
    output = "Overall Score Based on " + results.rateSummary.length + " Course(s):";
  }
  
  return (
    <Container style={{ marginTop: '7em' }}>
      {loading ? (
          <h1>Loading results..</h1>
        ) : (
          <div>
          <h1>{results.name}<br/>{results.score}/5</h1><br/>
          <p>{output}</p>
          <Transition.Group>
            {results.rateSummary &&
              results.rateSummary.map((rateSummary, index) => (
                <dl key={index}>
                  <Card fluid color='violet'>
                    <Card.Content>
                      <Grid>
                        <Grid.Column floated='left' width={8}>
                          <h3>{rateSummary.courseID} {rateSummary.courseTitle}<br/>
                          {rateSummary.professor}</h3>
                        </Grid.Column>
                        <Grid.Column floated='right' width={4}>
                          <p>Overall Course Score: {rateSummary.avgCourseScore}/5<br/>
                          Overall Professor Score: {rateSummary.avgProfScore}/5</p>
                        </Grid.Column>
                      </Grid>
                    </Card.Content>
                    <Card.Content>
                      {rateSummary.ratings && rateSummary.ratings.map((rating, index) => (
                        <dl key={index}><Rating rating={rating} /></dl>
                      ))}
                    </Card.Content>
                  </Card>
                </dl> 
              ))}
          </Transition.Group>
          </div>
        )}
    </Container>
  );
}

const FETCH_PROF_QUERY = gql`
  query($name: String!) {
    getProfessorDetail(query: $name) {
      name
      score
      numRate
      rateSummary{
        professor
        courseID
        courseTitle
        avgProfScore
        avgCourseScore
        numRate
        ratings{
          username
          anonymity
          term
          courseScore
          professorScore
          comment
          upvotes
          downvotes
          id
        }
      }
    }
  }
`;

export default RateProf;
