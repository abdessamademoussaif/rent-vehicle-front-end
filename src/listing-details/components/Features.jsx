import React from 'react'
import { FaCheck } from "react-icons/fa";
function Features({Features}) {
  return (
        <div className='p-10 rounded-xl border shadow-xl my-7'>
            <h2 className='font-medium text-2xl'>Features</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-7'>
                {Features.map((feature,index)=>(
                    <div className='flex gap-2 items-center' key={index}>
                        <FaCheck className='text-lg p-1 rounded-full h-8 w-8 bg-blue-100 text-primary '/>
                        <h2>{feature}</h2>
                    </div>
                ))}
            
            </div> 
        </div>
  )
}

export default Features