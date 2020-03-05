import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Form, Transition } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import ResultCard from '../components/ResultCard';

function Search(props) {
  const input = props.match.params.input;
  const { user } = useContext(AuthContext);

  const {
    loading,
    data: {getSearchResult : results}
  } = useQuery(FETCH_SERACH_QUERY, {
    variables: {
      input
    }
  });

  function onSubmit() {
    var input = document.getElementById("input").value;
    if (input!=""){
      props.history.push(`/search/${input}`);
      document.getElementById("input").value = "";
    }
  }

  return (
    <div>
        <Form onSubmit={onSubmit} >
        <Form.Group widths='equal'>
            <Form.Input
                id="input"
                name="input"
                type="text"
                placeholder="Look up a professor or course..."
            />
            <Form.Button type="submit" content='Search' color="violet"/>
        </Form.Group>
        </Form>
      
       {loading ? (
          <h1>Loading results..</h1>
        ) : (
          <Transition.Group>
            {results &&
              results.map((result) => (
                <ResultCard result={result} />
              ))}
          </Transition.Group>
        )}
    </div>
  );
}

const FETCH_SERACH_QUERY = gql`
  query($input: String!) {
    getSearchResult(query: $input) {
      category
      name
      score
      numRate
    }
  }
`;

export default Search;
