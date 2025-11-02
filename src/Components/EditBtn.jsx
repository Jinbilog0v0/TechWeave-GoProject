import React from 'react'

const EditBtn = ({ onEdit }) => {
  return (
    <div>
        <button onClick={onEdit}
        className='bg-blue-500 w-[100px] hover:bg-blue-600 text-white px-3 py-1 rounded-md ml-2'>
            Edit
        </button>
    </div>
  )
}

export default EditBtn