import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Card, Container, Divider, Dropdown, Form, Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

function ShoppingCart() {
    const { user } = useContext(AuthContext);
    const options = [
        { key: 1, text: 'Required', value: "required" },
        { key: 2, text: 'Interested', value: "interested" },
        { key: 3, text: 'Giveupable', value: "giveupable" },
        { key: 4, text: 'Delete', value: "remove", icon: "trash"}
    ]
    const {
        loading, 
        data: {getShoppingCart : results}
    } = useQuery(FETCH_SHOPPING_CART_QUERY, {
        variables: { username: user.username }
    });

    const [changePriority] = useMutation(CHANGE_PRIORITY_MUTATION, {
        update(cache, mutationResult) {
            if (mutationResult.data["changeCoursePriority"]) {
                const data = cache.readQuery({
                    query: FETCH_SHOPPING_CART_QUERY,
                    variables: { username: user.username }
                });
                const result = mutationResult.data["changeCoursePriority"];
                for (var course of data.getShoppingCart) {
                    if (course.courseID === result["courseID"] && 
                    course.courseTitle === result["courseTitle"]) {
                        course.priority = result["priority"];
                        break;
                    }
                };
                cache.writeQuery({ query: FETCH_SHOPPING_CART_QUERY, data });
            }
        }
    })

    const [removeFromCart] = useMutation(REMOVE_FROM_CART_MUTATION, {
        update(cache, mutationResult) {
            if (mutationResult.data["removeFromShoppingCart"]) {
                const data = cache.readQuery({
                    query: FETCH_SHOPPING_CART_QUERY,
                    variables: { username: user.username }
                });
                const result = mutationResult.data["removeFromShoppingCart"];
                const cart = data.getShoppingCart;
                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].courseID === result["courseID"] && 
                    cart[i].courseTitle === result["courseTitle"]) {
                        data.getShoppingCart.splice(i, 1);
                        break;
                    }
                }
                cache.writeQuery({ query: FETCH_SHOPPING_CART_QUERY, data });
            }
        }
    })

    function onChange (e, {name, value}) {
        const course = JSON.parse(name);
        if (value === 'remove') {
            removeFromCart(
                {variables: {
                    username: user.username,
                    courseID: course.id,
                    courseTitle: course.title
                }
            })
        } else {
            changePriority(
                {variables: {
                    username: user.username,
                    courseID: course.id,
                    courseTitle: course.title,
                    priority: value
                }
            })
        }
    }

    function selectAll() {
        var checkboxes = document.getElementsByName("selectedCourse");  
        var isDeselect = true;
        for (var checkbox of checkboxes)  {
            if (!checkbox.checked) {
                isDeselect = false;
                break;
            }
        }
        for (var i = 0; i<checkboxes.length; i++)  {
            isDeselect ? checkboxes[i].checked=false : checkboxes[i].checked=true;
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
                            name={JSON.stringify({ id: result.courseID, title: result.courseTitle })}
                            options={options}
                            value={result.priority}
                            onChange={onChange}/>
                        <Form.Field control='input' type='checkbox' name="selectedCourse" 
                        value={result.courseID} style={{ margin: '7% 45% 0 45%' }}/>
                    </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <h2>{result.courseID} {result.courseTitle}</h2>
                        <p>Course Score: {result.score} (based on {result.numRate} ratings)</p>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
                </dl>
            ))}
        </Card>
        <Grid style={{ marginLeft: '5px' }}>
            <Grid.Column width={3}>
                <Button fluid color="violet" onClick={selectAll}>Select/Deselect All</Button>
            </Grid.Column>
            <Grid.Column width={13}>
                <Button fluid color="violet" type="submit">Generate Schedule</Button>
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
                <h3>Loading results..</h3>
            ) : (
                shoppingCart
            )}
        </Container>
    )
}

const FETCH_SHOPPING_CART_QUERY = gql`
  query($username: String!) {
    getShoppingCart(username: $username) {
      courseID
      courseTitle
      score
      numRate
      priority
    }
  }
`;

const CHANGE_PRIORITY_MUTATION = gql`
  mutation changeCoursePriority(
    $username: String!,
    $courseID: String!,
    $courseTitle: String!,
    $priority: String!
  ) {
    changeCoursePriority(
        username: $username, 
        courseID: $courseID,
        courseTitle: $courseTitle,
        priority: $priority
    ) {
      courseID
      courseTitle
      score
      numRate
      priority
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromShoppingCart(
    $username: String!,
    $courseID: String!,
    $courseTitle: String!
  ) {
    removeFromShoppingCart(
        username: $username, 
        courseID: $courseID,
        courseTitle: $courseTitle
    ) {
      courseID
      courseTitle
    }
  }
`;

export default ShoppingCart;