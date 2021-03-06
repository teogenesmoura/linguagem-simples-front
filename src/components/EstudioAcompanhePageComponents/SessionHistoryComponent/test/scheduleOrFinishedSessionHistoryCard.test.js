import React from 'react';
import { mount} from 'enzyme';
import ScheduleOrFinishedSessionHistoryCard from '../scheduleOrFinishedSessionHistoryCard'



describe('Testing ScheduleOrFinishedSessionHistoryCard Card', () => {

  it("should render the ScheduleOrFinishedSessionHistoryCard component and match snapshot ", () => {
    var mockedPropsdata = {
        "id": 2,
        "created": "2020-08-05T15:43:19.753797-03:00",
        "modified": "2020-08-06T13:09:25.829329-03:00",
        "location": "plenary",
        "date": "2020-08-06",
        "type_session": "virtual",
        "situation_session": "pre_session",
        "resume": "Resumo"
        }

    const component = mount(<ScheduleOrFinishedSessionHistoryCard infoSession={mockedPropsdata}/>);

    expect(component.exists()).toEqual(true);
    expect(component).toMatchSnapshot();
  });


});
