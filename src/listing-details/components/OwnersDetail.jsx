import { Button } from '@/components/ui/button'
import React from 'react'

function OwnersDetail({Owner}) {
  return (
    <div className='p-10 border rounded-xl shadow-md mt-7'>
        <h2 className='font-medium text-2xl mb-3' >Owner/Deals</h2>
        <img src={Owner?.profileImg} className='w-[70px] h-[70px] rounded-full border shadow-sm'/>
        <h2 className='mt-2 font-bold text-xl'>{Owner?.name}</h2>
        <h2 className='mt-2 text-gray-500'>{Owner?.email}</h2>
        <Button className='w-full mt-6'>Message Owner</Button>
    </div>
  )
}

export default OwnersDetail