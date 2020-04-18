import { Button, Popup } from 'semantic-ui-react';
import React from 'react';

function MyPopup({ content, children, courseCallback }) {
  if (courseCallback) {
    return <Popup hoverable trigger={children} position='top center' style={{width:"175px"}}> 
      <div className="event" ><b>{content.extendedProps.course}</b>
      <br/>Class No: [{content.extendedProps.classNo}]
      <br/>Section Score: {content.extendedProps.score}/5
      <br/>Course Score: {content.extendedProps.courseScore}/5
      <br/>Professor Score: {content.extendedProps.profScore}/5<br/><br/></div>
      { content.extendedProps.locked ?
        <Button fluid onClick={courseCallback} value={content}>Unlock</Button>:
        <Button fluid onClick={courseCallback} value={content}>Lock</Button>
      }
    </Popup>;
  }
  return <Popup inverted content={content} trigger={children}/>;
}

export default MyPopup;
