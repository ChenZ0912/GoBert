import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Card, Container, Divider, Dropdown, Form, Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import Scheduler from './Scheduler';

function getSemesters (semesters) {
    var options = [];
    for (var i = 0; i < semesters.length; ++i) {
        options.push({key: i+1, text: semesters[i], value: semesters[i]})
    }
    return options;
}

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
                for (var course of data.getShoppingCart.courses) {
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
                const cart = data.getShoppingCart.courses;
                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].courseID === result["courseID"] && 
                    cart[i].courseTitle === result["courseTitle"]) {
                        data.getShoppingCart.courses.splice(i, 1);
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

    const [clear, setClear] = useState(false);
    const [scheduleInput, setInput] = useState({});
    // const [scheduleInput, setInput] = useState({
    //     username: user.username,
    //     term: "Fall 2019",
    //     intendedCourses: ["5e790d64199406c82611abb9"]
    // });
    function clearSchedule() {
        setInput({});
        setClear(false);
    }
    function generateSchedule(e, {value}) {
        var intendedCourses = [];
        var checkboxes = document.getElementsByName("selectedCourse");  
        for (var i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked) intendedCourses.push(checkboxes[i].value);
        }
        setInput({
            username: user.username,
            term: value,
            intendedCourses: intendedCourses
        });
        setClear(true);
    }

    return (
        <Container style={{ marginTop: '7em' }}>
            <h1>Shopping Cart</h1>
            <Divider/>
            {loading ? (
                <h3>Loading results..</h3>
            ) : ( results && results.courses && results.courses.length !== 0) ? (
            <Form>
            <Card fluid>
                {results.courses.map((result, index) => (
                    <dl key={index}>
                    <Grid style={{ marginLeft: '5px' }}>
                        <Grid.Column width={3}>
                            <Dropdown
                                fluid button selection
                                name={JSON.stringify({ id: result.courseID, title: result.courseTitle })}
                                options={options}
                                value={result.priority}
                                onChange={onChange}/>
                            <Form.Field control='input' type='checkbox' name="selectedCourse" 
                            value={result._id} 
                            style={{ margin: '7% 45% 0 45%' }}/>
                        </Grid.Column>

                        <Grid.Column width={10}>
                            <h2>{result.courseID} {result.courseTitle}</h2>
                            <p>Course Score: {result.score} (based on {result.numRate} ratings)</p>
                        </Grid.Column>
                    </Grid>
                    </dl>
                ))}
            </Card>
            <Grid style={{ marginLeft: '5px', marginRight: '5px'}}>
                <Grid.Column width={3}>
                    <Button fluid color="violet" onClick={selectAll}>Select / Deselect All</Button>
                </Grid.Column>
                <Grid.Column width={13}>
                <Button.Group fluid color="violet">
                    {clear ? <Button onClick={clearSchedule}>Clear</Button>:
                    <Dropdown
                        labeled button selection
                        icon='calendar alternate'
                        className='button icon'
                        text="Generate Schedule For Semester ..."
                        options={getSemesters(results.semesters)}
                        onChange={generateSchedule}
                    />}
                </Button.Group>
                </Grid.Column>
            </Grid>
            {scheduleInput.term && <Scheduler scheduleInput={scheduleInput}/>}
            </Form>
        ) : (
            <h3>Your shopping cart is empty.</h3>
        )}
        </Container>
    )
}

const FETCH_SHOPPING_CART_QUERY = gql`
  query($username: String!) {
    getShoppingCart(username: $username) {
      courses{
        courseID
        courseTitle
        score
        numRate
        priority
        _id
      }
      semesters
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
