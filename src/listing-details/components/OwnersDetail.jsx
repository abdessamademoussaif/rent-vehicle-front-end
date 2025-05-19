import { Button } from '@/components/ui/button'
import React from 'react'

function OwnersDetail({ Owner }) {
  return (
    <div className='p-6 sm:p-10 border rounded-xl shadow-md mt-7 max-w-sm w-full'>
      <h2 className='font-medium text-2xl mb-3'>Owner/Deals</h2>
      <img
        src={Owner?.profileImg}
        className='w-[70px] h-[70px] rounded-full border shadow-sm'
        alt='Owner Profile'
      />
      <h2 className='mt-2 font-bold text-xl break-words text-center'>{Owner?.name}</h2>
      <h2 className='mt-2 text-gray-500 break-words text-sm text-center'>
        {Owner?.email}
      </h2>
      <Button className='w-full mt-6'>Message Owner</Button>
    </div>
  )
}

export default OwnersDetail
