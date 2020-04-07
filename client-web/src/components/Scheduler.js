import React from 'react';
import { Card } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timegrid/main.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

function getCourses (schedule) {
  var events = []
  for (var course of schedule) {
    if (!course.daystimes.TBA) {
      events.push({
        title: course.courseID+' ('+course.classNo+')\n '+course.courseTitle+'\n'+course.professor,
        url: "/rateCourse/"+course._id,
        daysOfWeek: course.daystimes.daysOfWeek,
        startTime: course.daystimes.start,
        endTime: course.daystimes.end,
        // startRecur:
        // endRecur:
      })
    }
  }
  return events;
}

function Scheduler({scheduleInput}) {
  const {
    loading,
    data: {generateSchedule : results}
  } = useQuery(GENERATE_SCHEDULE_QUERY, {
    variables: { 
      username: scheduleInput.username,
      term: scheduleInput.term
    }
  });

  if (!loading) {
    console.log(results);
  }
  
  return (
  <>
    <br/>
    {!loading && results &&
      <Card fluid style={{marginBottom: "50px"}}>

        {results["noSection"] && results["noSection"].length !== 0 &&
          <Card.Content>
          <h3>Oh No! The following courses are NOT availble</h3>
          {results["noSection"].map((section, index) => (
            <ul key={index}><b>• {section.courseID} {section.courseTitle}</b> - {section.reason}</ul>
          ))}
          </Card.Content>
        }

        <Card.Content>
        <h3>Generated {results["schedule"].length} Schedules</h3>
        {results["schedule"] &&
          results["schedule"].map((schedule, index) => (
            <dl key={index}> 
            <FullCalendar
              defaultView="timeGridWeek"
              defaultDate = '2020-01-27'
              // defaultDate = '1999-01-25'
              header={{left: false, right: false}}
              columnHeaderFormat = {{weekday: 'long'}}
              plugins={[timeGridPlugin]}
              events={getCourses(results["schedule"][index])}
            />
            </dl>
        ))}
        
        </Card.Content>
      </Card>}
  </>
  );
}

const GENERATE_SCHEDULE_QUERY = gql`
  query generateSchedule(
    $username: String!,
    $term: String!
  ) {
    generateSchedule (
      username: $username,
      term: $term
    ) {
      noSection{
        courseID
        courseTitle
        priority
        reason
      }
      schedule{
        _id
        classNo
        courseID
        courseTitle
        professor
        dates
        daystimes{
          TBA
          daysOfWeek
          start
          end
        }
      }
    }
  }
`

export default Scheduler;
