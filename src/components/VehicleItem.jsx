import React from 'react'
import { Separator } from './ui/separator'
import { LuFuel } from "react-icons/lu";
import { IoSpeedometerOutline } from "react-icons/io5";
import { GiGearStickPattern } from "react-icons/gi";
import { IoMdOpen } from "react-icons/io";
import { Link } from 'react-router-dom';

function VehicleItem({vehicle}) {
  return (
    <Link to={'/listing-details/'+vehicle._id}> 
        <div className="relative bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl sm:w-full" >
            {vehicle.condition === 'new' && <h2 className="absolute m-2 px-2 bg-green-500 rounded-full text-sm text-white">New</h2>}
            {/* show avarage rating */}
            {vehicle?.ratingsAverage && <h2 className="absolute m-2 px-2 bg-yellow-500 rounded-full text-sm text-white right-0">{vehicle?.ratingsAverage} ⭐</h2>}
            <img src={vehicle?.imageCover}  className="rounded-t-xl w-full h-[200px] object-cover" />
            <div className='p-4'>
                <h2 className='font-bold text-black text-lg mb-2'>{vehicle?.name}</h2>
                <Separator className="bg-gray-200"/>
                <div className='grid grid-cols-3 mt-5'>
                    <div className='flex flex-col items-center'>
                        <LuFuel className='text-lg mb-2'/>
                        <h2>{vehicle?.mileage} Miles</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <IoSpeedometerOutline className='text-lg mb-2'/>
                        <h2>{vehicle?.fuelType}</h2>
                    </div>
                    <div className='flex flex-col items-center'>
                        <GiGearStickPattern className='text-lg mb-2'/>
                        <h2>{vehicle?.transmission}</h2>
                    </div>
                </div>
                <Separator className="bg-gray-200"/>
                <div className='flex items-center justify-between'>
                <h2 className='font-bold text-xl'>{vehicle?.pricePerDay.toLocaleString()}<span className='text-[12px]'>DH</span></h2>
                    <h2 className='text-primary text-sm flex gap-2 items-center hover:underline'>  View Details <IoMdOpen /></h2>
                </div>
            </div>
        </div> 
    </Link>
  )
}

export default VehicleItem