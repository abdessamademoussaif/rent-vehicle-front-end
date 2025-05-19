import React from 'react'
import { FaCheck } from "react-icons/fa";

function Features({ Features }) {
  return (
    <div className='p-6 sm:p-10 rounded-xl border shadow-xl my-7'>
      <h2 className='font-medium text-2xl'>Features</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5'>
        {Features.map((feature, index) => (
          <div
            key={index}
            className='flex items-start gap-3 min-w-0 '
          >
            <FaCheck className='flex-shrink-0 h-7 w-7 text-primary bg-blue-100 p-1 rounded-full' />
            <h2 className='text-sm break-words'>{feature}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Features
