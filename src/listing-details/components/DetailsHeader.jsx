import React from 'react'
import { HiCalendarDays } from "react-icons/hi2";
import { BsSpeedometer2 } from "react-icons/bs";
import { GiGearStick } from "react-icons/gi";
import { RiGasStationLine } from "react-icons/ri";

function DetailsHeader({VehicleDetail}) {
  return (
    <div>
      {VehicleDetail ? <div>
        <h2 className='font-bold text-3xl'>{VehicleDetail.title}</h2>
        <p className='text-sm'>new and other vital information to help you</p>
        <div className='flex flex-wrap gap-2 mt-3'>
          <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
            <HiCalendarDays className='h-7 w-7 text-primary '/>
            <h2 className='text-primary'>{VehicleDetail.year}</h2>
          </div>

          <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
            <BsSpeedometer2 className='h-7 w-7 text-primary '/>
            <h2 className='text-primary'>{VehicleDetail.mileage}</h2>
          </div>
          
          <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
            <GiGearStick className='h-7 w-7 text-primary '/>
            <h2 className='text-primary'>{VehicleDetail.transmission}</h2>
          </div>

          <div className='flex gap-2 items-center bg-blue-50 rounded-full p-2 px-3'>
            <RiGasStationLine className='h-7 w-7 text-primary '/>
            <h2 className='text-primary'>{VehicleDetail.fuelType}</h2>
          </div>
        </div>
      </div>:
      <div className='w-full rounded-xl h-[100px] bg-slate-200 animate-pulse'>
      </div>}
    </div>
   
  )
}

export default DetailsHeader