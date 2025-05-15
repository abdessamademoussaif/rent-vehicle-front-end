import React from 'react'
import Search from './Search'

function Hero() {
  return (
    <div>
        <div className='flex flex-col items-center p-10 py-20 gap-6 h-[300px]   w-full bg-[#eef0fc]'>
            {/*<h2 className='text-lg'>Find vehicle for sale and for rent near you</h2>
            <h2 className='text-[60px] font-bold'>Find Your Fucking vehicle</h2>
            <Search/>*/}
            <img src="/pekup.png" className='mt-[-80px]' />
        </div>
    </div>
  )
}

export default Hero