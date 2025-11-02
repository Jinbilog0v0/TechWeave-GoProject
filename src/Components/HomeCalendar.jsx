import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './CalendarStyle.css'
import DeleteBtn from './DeleteBtn'
import EditBtn from './EditBtn'

const HomeCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState({});
    const [editingTaskIndex, setEditingTaskIndex] = useState(null);

    const handleDateClick = (date) => {
        setSelectedDate(date);

    }

    const handleSaveTask = () => {
        if(task.trim() === "") return
        const dateKey = selectedDate.toDateString()

        setTasks((prev) => {
            const updated = { ...prev }
            if(!updated[dateKey]) updated[dateKey] = []
            if(editingTaskIndex !== null) {
                updated[dateKey][editingTaskIndex] = task
            } else {
                updated[dateKey].push(task)
            }

            return updated
        })

        setTask("")
        setIsModalOpen(false)
        setEditingTaskIndex(null)
    }

    const handleEditTask = (date, index) => {
        setSelectedDate(new Date(date))
        setTask(tasks[date][index])
        setEditingTaskIndex(index)
        setIsModalOpen(true)
    }

    const handleDeleteTask = (date, index) => {
        setTasks((prev) => {
            const updatedTasks = { ...prev };
            updatedTasks[date] = updatedTasks[date].filter((_, i) => i !== index);

            if(updatedTasks[date].length ===0) {
                delete updatedTasks[date];
            }
            return updatedTasks;
        })
    }

  return (
    <div className='flex justify-start items-start gap-8 mt-12 pl-12 pr-6 ' style={{marginLeft: "-140px"}}>
    <div className='w-[600px] bg-white rounded-2xl shadow-2xl p-6'>

        <Calendar  onClickDay={handleDateClick} value={selectedDate}
          className={`rounded-xl p-4`} />

        {selectedDate && (

            <div className='flex justify-between items-center mt-4'>
                <p className='mt-4 text-gray-700 font-medium'>{selectedDate.toDateString()}</p>
           
                <button className='bg-green-600 p-2 w-[100px] rounded-xl text-white'
                onClick={() => setIsModalOpen(true)} >Set task</button>
            </div>

        )}
    </div>

    <div className='flex-1 border border-gray-200 rounded-xl p-4 max-h-[400px] overflow-y-auto'>
        <h2 className='text-lg font-semibold mb-3 text-gray-800'>Your Tasks</h2>

        {Object.keys(tasks).length === 0 ? (
            <p className='text-gray-400 italic'>No tasks yet.</p>
        ) : (
            Object.entries(tasks).map(([date, taskList]) => (
                <div key={date} className='mb-4 p-3 bg-gray-50 rounded-lg shadow-md'>
                    <h3 className='font-medium text-green-700'>{date}</h3>
                    <ul className='list-disc list-inside text-gray-700 mt-1'>
                        {taskList.map((t, i) => (
                            <li key={i} className='flex justify-between'>

                                <div>
                                 {t}
                                </div>

                                <div className='flex gap-2 justify-center'>
                                    <EditBtn onEdit={() => handleEditTask(date, i)}/>
                                    <DeleteBtn onDelete={() => handleDeleteTask(date, i)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))
        )}
    </div>

        {isModalOpen && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'> 
                <div className='bg-white p-6 rounded-2xl shadow-2xl w-[380px]'>
                    <h2 className='text-lg font-semibold text-gray-800 mb-3'>
                    {editingTaskIndex !== null ? `Edit task: ${selectedDate?.toDateString()}` : `Set task: ${selectedDate?.toDateString()}`}
                    </h2>    
                
                    <textarea value={task} onChange={(e) => setTask(e.target.value)}
                    placeholder='Enter your task...' 
                    className='w-full border border-gray-300 rounded-md p-2 mb-4 outline-none' rows={3} />

                    <div className='flex justify-end gap-3'>

                        <button onClick={()=> setIsModalOpen(false)}
                        className='px-4 py-2 rounded-lg bg-gray-300 text-gray-700'>
                        Cancel
                        </button>

                        <button onClick={handleSaveTask}
                        className='px-4 py-2 rounded-lg bg-green-600 text-white'>
                        Save
                        </button>

                    </div>         
                </div>
            </div>
        )}

    </div>
  );
}

export default HomeCalendar