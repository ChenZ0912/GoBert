import React from 'react';
import { Container, Divider, Icon } from 'semantic-ui-react';

function About() {
    return (
        <Container className='center'>
            <h1>About GoBert</h1>
            <p> Our project, GoBbert, was inspired by the schedule making process at NYU. 
                First, it is important to have a good schedule that really fits the students’ interests 
                and making the college life worth it. A bad schedule might overwork a student. 
                In order to make a good schedule, every NYU student need to go through 
                RateMyProfessor, NYU Albert, and friends’ recommendations. This is especially difficult 
                during the course enrollment days. The popular courses are closed quickly. 
                Students have to make a decision quickly to enroll in another course before the plan B 
                course close. However, this is tough because we need to make sure the plan B course 
                is a good course, the prerequisites are met, does not conflict with other courses on the 
                existing schedule, etc. </p>
            <p> What if we can have something to automate this process? 
                This is where our project was first formulated. We want students to add all the classes 
                that they need and interested to their shopping cart, then our web extension would be able 
                to do all the work for students - generating multiple schedules ranked from most recommended 
                to least recommended in a visual way that allow students to choose what they truly need quickly.
                In addition, we have a lock section feature to help select from all the generated schedules.
            </p>
            <Divider/>
            <h1>FAQs</h1>
            <b>To be added... (+_+)?</b>
            <p>PS: Feel free to contact us with any questions</p>
            <Divider/>
            <h1>Contact Us</h1>
            <Icon name="phone"/> 1(666) GOBERT<br/>
            <Icon name="mail"/> support@gobert.com
        </Container>
    );
}

export default About;