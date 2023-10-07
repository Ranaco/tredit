/* eslint-disable react-hooks/exhaustive-deps */
import { default as React } from "react";

const DEFAULT_INITIAL_DATA = () => {
  return {
    events: [
      {
        time: "Time",
        description: "Description",
      },
    ],
  };
};

const EventTimeline = (props: any) => {
  const [timelineData, setTimelineData] = React.useState(
    props.data.events.length > 0 ? props.data : DEFAULT_INITIAL_DATA,
  );

  const updateTimelineData = (newData: any) => {
    setTimelineData(newData);
    if (props.onDataChange) {
      // Inform editorjs about data change
      props.onDataChange(newData);
    }
  };

  const onAddEvent = (e: any) => {
    const newData = {
      ...timelineData,
    };
    newData.events.push({
      time: "Time",
      description: "Description",
    });
    updateTimelineData(newData);
  };

  const onContentChange = (index: number, fieldName: any) => {
    return (e) => {
      const newData = {
        ...timelineData,
      };
      newData.events[index][fieldName] = e.currentTarget.textContent;
      updateTimelineData(newData);
    };
  };

  return (
    <React.Fragment>
      <div className={"pt-[8px] bg-[#efefef]"}>
        <Timeline align="left">
          {timelineData.events.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent className={classes.time}>
                <Typography
                  color="textSecondary"
                  onBlur={onContentChange(index, "time")}
                  suppressContentEditableWarning={!props.readOnly}
                  contentEditable={!props.readOnly}
                >
                  {event.time}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot className={classes.timelinedot} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} className={classes.description}>
                  <Typography
                    color="primary"
                    onBlur={onContentChange(index, "description")}
                    suppressContentEditableWarning={!props.readOnly}
                    contentEditable={!props.readOnly}
                  >
                    {event.description}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
          {!props.readOnly && (
            <TimelineItem>
              <TimelineOppositeContent className={classes.oppositeInButton} />
              <TimelineSeparator>
                <TimelineDot
                  color="primary"
                  className={classes.addButton}
                  onClick={onAddEvent}
                >
                  <Typography className={classes.addButtonText}> + </Typography>
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent />
            </TimelineItem>
          )}
        </Timeline>
      </div>
    </React.Fragment>
  );
};

export default EventTimeline;
