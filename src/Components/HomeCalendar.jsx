import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'


const HomeCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        console.log('Selected date: ', date);
    };

  return (
    <div p-4 bg-white rounded-lg shadow mt-10>
        <Calendar  onClickDay={handleDateClick} value={selectedDate} />
        {selectedDate && (
            <p className='mt-4 text-gray-700 font-medium'>{selectedDate.toDateString()}</p>
        )}
    </div>
  );
}

export default HomeCalendar