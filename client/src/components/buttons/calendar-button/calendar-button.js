import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Popover } from '../../popup/popup';
import { DateRangePickerOne } from '../../datePicker/datePicker';
import { Button } from '../buttons';

const CalendarButtonPageHeader = ({updateRangeDate}) => {
  const content = (
    <>
      <DateRangePickerOne updateRangeDate={updateRangeDate}/>
    </>
  );
  
  return (
    <Popover placement="bottomRight" title="Search by Calendar" content={content} action="hover">
      <Button size="small" type="white">
        <FeatherIcon icon="calendar" size={14} />
        Date Range
      </Button>
    </Popover>
  );
};

export { CalendarButtonPageHeader };
