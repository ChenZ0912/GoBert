import { Popup } from 'semantic-ui-react';
import React from 'react';

function MyPopup({ content, children }) {
  const event = content.extendedProps;
  if (event) {
    content = '\nClass No: ' + event.classNo;
    content += '\nCourse Score: ';
    content += (event.courseScore) ? event.courseScore + '/5' : 'N/A';
    content += '\nRMP Prof Score: ';
    content += (event.rmpScore) ? event.rmpScore + '/5' : 'N/A';
    content += '\nGoBert Prof Score: ';
    content += (event.profScore) ? event.profScore + '/5' : 'N/A';
  }

  return (event)?
    <Popup inverted hoverable className='event' trigger={children}>
      <a href={event.link}><b>{event.course}</b></a> {content}
    </Popup>:
    <Popup inverted content={content} trigger={children}/>;
}

export default MyPopup;
