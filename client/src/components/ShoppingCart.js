import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Card, Container, Divider, Dropdown, Form, Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import Scheduler from './Scheduler';

function getSemesters (semesters) {
    if (semesters.length > 2) semesters=semesters.slice(-2);

    var options = [];
    for (var i = 0; i < semesters.length; ++i) {
        options.push({key: i, text: semesters[i], value: semesters[i]})
    }
    return options;
}

function ShoppingCart() {
    const { user } = useContext(AuthContext);
    const options = [
        { key: 1, text: 'Required', value: "required" },
        { key: 2, text: 'Interested', value: "interested" },
        { key: 3, text: 'Delete', value: "remove", icon: "trash"}
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

    // const [scheduleInput, setInput] = useState({
    //     username: user.username,
    //     onlyOpen: true,
    //     term: "Fall 2020",
    //     intendedCourses:[
    //         "5e992743cf536b7bbf1c9f39",
    //         "5e992743cf536b7bbf1c91f7",
    //         "5e992743cf536b7bbf1c995e"
    //     ]
    // });

    const [clear, setClear] = useState(false);
    const [scheduleInput, setInput] = useState({});

    function clearSchedule() {
        setInput({});
        setClear(false);
    }
    function generateSchedule(e, {value}) {
        const onlyOpen = document.getElementById("onlyOpen").checked;
        var intendedCourses = [];
        var checkboxes = document.getElementsByName("selectedCourse");  
        for (var i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked) intendedCourses.push(checkboxes[i].value);
        }
        setInput({
            username: user.username,
            onlyOpen: onlyOpen,
            term: value,
            intendedCourses: intendedCourses
        });
        setClear(true);
    }

    return (
        <Container style={{ marginTop: '7em', marginBottom: '3em' }}>
            <h1>Shopping Cart</h1>
            <Divider/>
            {loading ? (
                <h3>Loading results...</h3>
            ) : ( results && results.courses && results.courses.length !== 0) ? (
            <Form>

            {/*Shopping Cart*/}
            <Card fluid>
                <Card.Content>
                {results.courses.map((result, index) => (
                    <dl key={index}>
                    <Grid>
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

                    <Grid.Column width={13}>
                        <a style={{color: "black"}} href={"/rateCourse/"+result._id}>
                            <h2>{result.courseID} {result.courseTitle}</h2></a>
                        {result.score === 0 ? 
                            <p>Course Score: N/A</p>:
                            <p>Course Score: {result.score}/5 (based on {result.numRate} ratings)</p>
                        }
                    </Grid.Column>
                    </Grid>
                    </dl>
                ))}
                </Card.Content>
            </Card>

            {/*Generate schedule*/}
            <Grid>
            <Grid.Column width={3}>
                <Button fluid color="violet" style={{ marginBottom: "5px" }} onClick={selectAll}>
                    Select / Deselect All</Button>
                <Form.Field 
                    control='input' type='checkbox' id='onlyOpen'
                    label='Include open sections only'
                    style={{ marginTop: "3px" }}/>
            </Grid.Column>
            <Grid.Column width={13}>
            <Button.Group fluid color="violet">
                {clear ? <Button onClick={clearSchedule}>Clear</Button>:
                <Dropdown
                    labeled button selection
                    icon='calendar alternate'
                    className='button icon'
                    text='Generate schedule for semester...'
                    options={getSemesters(results.semesters)}
                    onChange={generateSchedule}
                />}
            </Button.Group>
            </Grid.Column>
            </Grid>
            {/*Generated schedules*/}
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
