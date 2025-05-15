import React from 'react';
import VehicleSpecification from '@/Shared/VehicleSpecification';

function Specification({Vehicle}) {
  const vehicleData = {
    category: Vehicle.category==null ? 'N/A' : Vehicle.category.name,
    condition: Vehicle.condition,
    mark: Vehicle.mark?.name || 'N/A',
    model: 'RAV4',
    year: Vehicle.year,
    driveType: Vehicle.driveType,
    transmission: Vehicle.transmission,
    fuelType: Vehicle.fuelType,
    mileage: `${Vehicle.mileage} km`,
    engineSize: `${Vehicle.engineSize}`,
    cylinder: Vehicle.cylinders,
    color: Vehicle.color[0],
    door: Vehicle.doorCount,
  };

  return (
    <div className='p-10 rounded-xl border shadow-md mt-7'>
      <h2 className='font-medium text-2xl'>Specifications</h2>
      {Vehicle ? VehicleSpecification.map((item, index) => (
          <div key={index} className="mt-5 flex items-center justify-between">
            <div className="flex gap-5 items-center">
              <item.icon className="bg-blue-200 p-2 rounded-full text-4xl text-primary" />
              <span>{item.label}</span>
            </div>
            <span className="font-medium text-gray-700">
              {vehicleData[item.name] ?? 'N/A'}
            </span>
          </div>
        ))
        :
        <div className='w-full h-[500px] rounded-xl bg-slate-200 animate-pulse mt-7'></div>
      }
    </div>
  );
}

export default Specification;
