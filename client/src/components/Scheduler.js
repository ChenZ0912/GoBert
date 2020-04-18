import React, { useState, useEffect } from 'react';
import { Card, CardContent, Container, Icon } from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';
import ReactDOM from 'react-dom';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timegrid/main.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

/* eslint-disable */
var lockedCourse = [];

function getCourses (schedule) {
  
  var events = [];
  for (var key in schedule) {
    const course = schedule[key];
    const extra = {
      link: "/rateCourse/"+course._id,
      course: course.courseTitle,
      classNo: course.classNo,
      courseScore: course.courseScore,
      profScore: course.professorScore,
      rmpScore: course.rmpScore,
      locked: lockedCourse.includes(course.classNo)
    }

    if (course.TBA) {
      events.push({
        title: course.courseID+' - '+course.professor+' (Time: TBA)',
        daysOfWeek: [0],
        duration: { days: 7 },
        backgroundColor: course.color,
        borderColor: course.color,
        textColor: "black",
        extendedProps: extra
      }) 
    } else {
      events.push({
        title: '\n'+course.duration+'\n'+course.courseID+'\n'+course.professor,
        daysOfWeek: course.daysOfWeek,
        startTime: course.start,
        endTime: course.end,
        backgroundColor: course.color,
        borderColor: course.color,
        extendedProps: extra
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
  const [schedules, setSchedules] = useState([]);
  useEffect(() => {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Bearer "+localStorage.getItem('jwtToken')
      },
      body: JSON.stringify({query: `{generateSchedule( 
        username:${JSON.stringify(scheduleInput.username)} 
        onlyOpen:${JSON.stringify(scheduleInput.onlyOpen)} 
        term:${JSON.stringify(scheduleInput.term)} 
        intendedCourses:${JSON.stringify(scheduleInput.intendedCourses)}){
          noSection{ courseID courseTitle priority reason } 
          schedule{ courseID courseTitle TBA daysOfWeek start end
            professor classNo term _id priority dates duration color 
            rmpScore courseScore professorScore }}}`})
    })
      .then(r => r.json())
      .then(data => {
        if (!data["errors"]) {
          var schedulesTemp = [];
          for (var schedule of data["data"]["generateSchedule"]["schedule"]) {
            var scheduleDict = {};
            for (var course of schedule) {
              scheduleDict[course.classNo] = course;
            }
            if (Object.keys(scheduleDict).length !== 0)
              schedulesTemp.push(scheduleDict);
          }
          setSchedules(schedulesTemp);

          data["data"]["generateSchedule"]["schedule"] = schedulesTemp;
          setResults(data["data"]["generateSchedule"]);
          setLoading(false);
        }
      }
    );
  }, [])

  const lockCourse=(e, {value})=>{
    const classNo = value.extendedProps.classNo;
    const locked = value.extendedProps.locked

    if (locked) 
      lockedCourse = lockedCourse.filter(function(value){ return value !== classNo;})
    else lockedCourse.push(classNo);
    
    const isLock = lockedCourse.includes(classNo);
    value.setExtendedProp("locked",  isLock);
    
    var schedulesTemp = results["schedule"].filter(function(schedule){ 
      for (var lockCourse of lockedCourse) {
        if (!schedule[lockCourse])
          return false;
      }
      return true;
    })
    setSchedules(schedulesTemp);
  }
  
  // Render event
  const onRender=(info) => {
    ReactDOM.render(
      <MyPopup content={info.event}>
        <Container fluid>
          {info.event.extendedProps.locked ? 
            <Icon color='grey' name='lock' value={info.event} 
              onClick={lockCourse} style={{float: "right", margin: '1px 5px 0 0'}}/> : 
            <Icon color='grey' name='lock open' value={info.event} 
              onClick={lockCourse} style={{float: "right", margin: '1px 5px 0 0'}}/>}
          <div className="event">{info.event.title}<br/></div>
        </Container>
      </MyPopup>,
      info.el,
    );
    return info.el;
  }

  return (
    <>
    {loading ? (
      <h3>Loading results...</h3>
    ) : results &&
      <Card fluid style={{marginBottom: "50px"}}>
        <Card.Content style={{textTransform: "uppercase", padding: "7px",
          color: "#57068C", backgroundColor: "#E6E6FA"}}>
          <h3 align="center">{scheduleInput.term}</h3>
        </Card.Content>
        {results["noSection"] && results["noSection"].length !== 0 &&
          <CardContent>
          <h3><br/>Oh No! The following courses are NOT availble</h3>
          {results["noSection"].map((section, index) => (
            <ul key={index}><b>• {section.courseID} {section.courseTitle}</b> - {section.reason}</ul>
          ))}
          </CardContent>
        }
          
        <CardContent>
        {schedules && ((!results["noSection"] && scheduleInput.intendedCourses.length !== 0) 
        ||(results["noSection"] && scheduleInput.intendedCourses.length - results["noSection"].length !== 0)) ?
          <>
          <h3><br/>Generated {schedules.length} Schedules</h3>
          {schedules.map((schedule, index) => (
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
                eventRender={onRender}
              />
              </dl>
            ))}
          </> : <h3>No schedule available o((⊙﹏⊙))o</h3> }
        </CardContent>
      </Card>
    }
    </>
  );
}

export default Scheduler;

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
