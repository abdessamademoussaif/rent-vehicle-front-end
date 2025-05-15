import { Button } from '@/components/ui/button';
import React from 'react'
import { BiSolidOffer } from "react-icons/bi";

function Pricing({Price,OfferPrice}) {
  return (
    <div className='p-10 rounded-xl border shadow-md'>
        <h2>Price Per Day</h2>
        <h2 className='font-bold text-4xl'>{Price}<span className='text-[16px]'>DH</span></h2>
        <Button className='w-full mt-7' size='lg'><BiSolidOffer className='text-lg mr-2'/> Make an Offer Price</Button>
    </div>
  )
}

export default Pricing