import React from 'react'

function ImageGallery({imageUrl}) {
    return (
    <div>
        <img src={imageUrl} className='w-full h-[500px] object-cover rounded-xl' />
    </div>
  )
}

export default ImageGallery