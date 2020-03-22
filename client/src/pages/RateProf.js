import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Container, Divider, Transition } from 'semantic-ui-react';
import RatingCard from '../components/RatingCard';

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
          <h1>{results.name}<br/>{results.score}/5</h1>
          <Divider/>
          <h3>{output}</h3>
          <Transition.Group>
            {results.rateSummary &&
              results.rateSummary.map((rateSummary, index) => (
                <dl key={index}>
                  <RatingCard rateSummary={rateSummary} />
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
          _id
        }
      }
    }
  }
`;

export default RateProf;
