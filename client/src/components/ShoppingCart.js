import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Card, Container, Divider, Dropdown, Form, Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

function ShoppingCart() {
    useContext(AuthContext);

    const options = [
        { key: 1, text: 'Required', value: 1 },
        { key: 2, text: 'Interested', value: 2 },
        { key: 3, text: 'Giveupable', value: 3 },
        { key: 4, text: 'Remove', value: 4 },
    ]
    
    const {
        loading,
        data: {getShoppingCart : results}
    } = useQuery(FETCH_SHOPPING_CART_QUERY);

    function selectAll() {
        var checkboxes = document.getElementsByName("selectedCourse");  
        for (var i=0; i<checkboxes.length; i++)  {
            checkboxes[i].checked = true;
          }
    }

    function onSubmit() {
        var checkboxes = document.getElementsByName("selectedCourse");  
        for (var i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked) {
                console.log(checkboxes[i].value);
            }
        }
    }

    const shoppingCart = (results && results.length !== 0) ? (
        <Form onSubmit={onSubmit}>
        <Card fluid>
            {results.map((result, index) => (
                <dl key={index}>
                <Grid style={{ marginLeft: '5px' }}>
                    <Grid.Row>
                    <Grid.Column width={3}>
                    <Grid.Row>
                        <Dropdown
                            fluid
                            button
                            selection
                            options={options}
                            placeholder='Priority'/>
                        <Form.Field control='input' type='checkbox' name="selectedCourse" 
                        value={result.courseID} style={{ marginTop: '1em', marginLeft: '6em' }}/>
                    </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <p>{result.courseID} {result.courseTitle}<br/>
                        Course Score: {result.score} (based on {result.numRate} ratings)</p>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
                </dl>
            ))}
        </Card>
        <Grid style={{ marginLeft: '5px' }}>
            <Grid.Column width={3}>
                <Button fluid color="violet" onClick={selectAll}>Select All</Button>
            </Grid.Column>
            <Grid.Column width={13}>
                <Button fluid type="submit" color="violet">Generate Schedule</Button>
            </Grid.Column>
        </Grid>
        </Form>
    ) : (
        <h3>Your shopping cart is empty.</h3>
    );

    return (
        <Container style={{ marginTop: '7em' }}>
            <h1>Shopping Cart</h1>
            <Divider/>
            {loading ? (
                <h1>Loading results..</h1>
            ) : (
                shoppingCart
            )}
        </Container>
    )
}

const FETCH_SHOPPING_CART_QUERY = gql`
  {
    getShoppingCart {
      courseID
      courseTitle
      score
      numRate
    }
  }
`;

export default ShoppingCart;
