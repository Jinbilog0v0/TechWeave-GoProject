import React from 'react'

const DeleteBtn = ({ onDelete }) => {
  return (
    <div>
        <button onClick={onDelete}
        className='bg-red-500 w-[100px] hover:bg-red-600 text-white px-3 py-1 rounded-md ml-2'>
            Delete
        </button>
    </div>
  )
}

export default DeleteBtn