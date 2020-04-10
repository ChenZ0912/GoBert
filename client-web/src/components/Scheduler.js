import React, { useState, useEffect } from 'react';
import { Card, CardContent } from 'semantic-ui-react';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timegrid/main.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

function getCourses (schedule) {
  var colors = ["rgb(134,227,206)", "rgb(208,230,165)", 
  "rgb(255,221,148)", "rgb(250,137,123)", "rgb(204,171,219)" ];
  const colorSize = colors.length;
  for (var j = 0; j < (schedule.length-colorSize); ++j) {
    // generate extra colors if needed
    var found = true;
    while (found){
      var color = "rgb("+(Math.random()*100+150)+","+(Math.random()*100+150)+","+(Math.random()*100+150)+")";
      found = colors.includes(color);
      if (!found) colors.push(color);
    }
  }
  colors.sort(() => Math.random() - 0.5); // shuffle colors

  var events = [];
  for (var i = 0; i < schedule.length; ++i) {
    const course = schedule[i];
    if (course.TBA) {
      events.push({
        title: course.courseID+' ('+course.classNo+') Time: TBA\n'+course.courseTitle+' '+course.professor,
        url: "/rateCourse/"+course._id,
        daysOfWeek: [0],
        duration: { days: 7 },
        backgroundColor: colors[i],
        borderColor: colors[i],
        textColor: "black"
      }) 
    } else {
      events.push({
        title: course.courseID+' ('+course.classNo+')\n '+course.courseTitle+'\n'+course.professor,
        url: "/rateCourse/"+course._id,
        daysOfWeek: course.daysOfWeek,
        startTime: course.start,
        endTime: course.end,
        backgroundColor: colors[i],
        borderColor: colors[i],
        // startRecur:
        // endRecur:
      })
    }
  }
  return events;
}

function Scheduler({scheduleInput}) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});
  useEffect(() => {
    fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Bearer "+localStorage.getItem('jwtToken')
      },
      body: JSON.stringify({query: `{generateSchedule( username:${JSON.stringify(scheduleInput.username)} term:${JSON.stringify(scheduleInput.term)} intendedCourses:${JSON.stringify(scheduleInput.intendedCourses)}){noSection{ courseID courseTitle priority reason } schedule{ courseID courseTitle TBA daysOfWeek start end professor classNo term _id priority dates }}}`})
    })
      .then(r => r.json())
      .then(data => {
        if (data["errors"]) {
          setLoading(true);
          setResults([]);
        } else {
          setLoading(false);
          setResults(data["data"]["generateSchedule"]);
        }
      }
    );
  }, [])

  return (
    <>
    {!loading && results &&
      <Card fluid style={{marginBottom: "50px"}}>
        <Card.Content>
          <h2 align="center">{scheduleInput.term}</h2>
        </Card.Content>
        {results["noSection"] &&
          <CardContent>
          <h3><br/>Oh No! The following courses are NOT availble</h3>
          {results["noSection"].map((section, index) => (
            <ul key={index}><b>• {section.courseID} {section.courseTitle}</b> - {section.reason}</ul>
          ))}
          </CardContent>
        }
          
        <CardContent>
        {results["schedule"] && ((!results["noSection"] && scheduleInput.intendedCourses.length !== 0) 
        ||(results["noSection"] && scheduleInput.intendedCourses.length - results["noSection"].length !== 0)) ?
          <>
          <h3><br/>Generated {results["schedule"].length} Schedules</h3>
          {results["schedule"].map((schedule, index) => (
              <dl key={index}> 
              <FullCalendar
                defaultView="timeGridWeek"
                defaultDate = '1999-01-25'
                scrollTime = '08:00:00'
                slotDuration = '00:20:00'
                contentHeight = {725}
                header={{left: false, right: false}}
                columnHeaderFormat = {{weekday: 'long'}}
                plugins={[timeGridPlugin]}
                events={getCourses(schedule)}
              />
              </dl>
            ))}
          </> : <h3>No schedule available</h3> }
        </CardContent>
      </Card>
    }
    </>
  );
}

// import gql from 'graphql-tag';
// const GENERATE_SCHEDULE_QUERY = gql`
//   query generateSchedule(
//     $username: String!,
//     $term: String!,
//     $intendedCourses: [shoppingCartItem]!
//   ) {
//     generateSchedule (
//       username: $username,
//       term: $term,
//       intendedCourses: $intendedCourses,
//     ) {
//       noSection{
//         courseID
//         courseTitle
//         priority
//         reason
//       }
//       schedule{
//         _id
//         classNo
//         courseID
//         courseTitle
//         professor
//         TBA
//         daysOfWeek
//         start
//         end
//       }
//       scheduleLength
//     }
//   }
// `

export default Scheduler;
