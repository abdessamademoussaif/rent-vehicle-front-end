import React from 'react'

function InfoSection() {
  return (
    <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
                <div>
                    <div className="max-w-lg md:max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                            Book Your Freight Transport Vehicle Easily
                        </h2>

                        <p className="mt-4 text-gray-700">
                            Our platform simplifies the management and booking of freight transport vehicles. 
                            Quickly find a vehicle that suits your needs and track your reservations in real-time.
                        </p>
                    </div>
                </div>

                <div>
                    <img
                        src="https://images.pexels.com/photos/172074/pexels-photo-172074.jpeg"
                        className="rounded"
                        alt="Freight Transport Vehicle"
                    />
                </div>
            </div>
        </div>
    </section>

  )
}

export default InfoSection