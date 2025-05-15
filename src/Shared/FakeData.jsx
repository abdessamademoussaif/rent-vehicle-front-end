import { faker } from "@faker-js/faker"
function createRandomeVehicleList(){
    return{
        id:faker.vehicle.vin(),
        name:faker.vehicle.vehicle(),
        fuelType:faker.vehicle.fuel(),
        model:faker.vehicle.model(),
        type:faker.vehicle.type(),
        image:['https://cdn.motor1.com/images/mgl/BX2zNm/s3/untitled-design-8.jpg','https://cdn.pixabay.com/photo/2018/07/27/15/35/pickup-truck-3566293_640.jpg','https://i.pinimg.com/736x/ff/ce/28/ffce28916576787e9ebdab4a84d363b2.jpg','https://www.daimlertruck.com/fileadmin/_processed_/b/f/csm_eActros_300_20db152748.jpg','https://t3.ftcdn.net/jpg/06/45/68/18/360_F_645681892_ys2kveNK8xTRjf7nAoTDYyOCm3hBJ9yh.jpg','https://laquotidienne.ma/uploads/actualites/60375da87f5da.jpg','https://www.ford-trucks.de/fileadmin/user_upload/kipper_presse.jpg'],
        miles:[1004,3032,4343,1213,5453,1234,2023],
        gearType:'Automatic',
        price:faker.finance.amount({min:1000,max:6000}),
    };
}
const vehicleList = faker.helpers.multiple(createRandomeVehicleList,{
    count:20
})
export default{
    vehicleList
}