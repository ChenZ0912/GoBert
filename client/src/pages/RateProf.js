import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Container,Transition } from 'semantic-ui-react';
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
  
  return (
    <Container style={{ marginTop: '7em' }}>
      {loading ? (
          <h1>Loading results..</h1>
        ) : (
          <div>
          <h1>{results.name}</h1>
          <h1>{results.score}/5</h1><br/>
          <p>Overall Score Based on {results.numRate} Ratings:</p>
          <Transition.Group>
            {results.ratings &&
              results.ratings.map((rating) => (
                <RatingCard rating={rating} name={results.name} />
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
      ratings {
        courseID
        courseTitle
        avgProfScore
        avgCourseScore
        numRate
      }
    }
  }
`;

export default RateProf;
