import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './home'
import Contact from './contact'
import Profile from './profile'
import AddListing from './add-listing'
import ListingDetails from './listing-details/[id]'
import ProfileStting from './profile-setting'
import AdminDashboard from './AdminDashboard'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux'
import { store } from './redux/store'
import ReservationDetails from './reservation-details/ReservationDetails'
import UserReservations from './reservation-details/UserReservations'
import AboutUs from './aboutUs'
import UpdateVehicle from './update-vehicle'
const router = createBrowserRouter([
  {
    path:'/',
    element: <Home/>
  },
  {
    path:"contact",
    element:<Contact/>
  },
  {
    path:'/profile',
    element:<Profile/>
  },
  {
    path:'/add-listing',
    element:<AddListing/>
  },
  {
    path:'/listing-details/:id',
    element:<ListingDetails/>
  },
  {
    path:'/profile-setting',
    element:<ProfileStting/> 
  },
  {
    path:'/dashboard',
    element:<AdminDashboard/>
  },
  {
    path:'/reservations/:id',
    element:<ReservationDetails/>
  },
  {
    path:'/userReservation',
    element:<UserReservations/>
  },
  {
    path:'/about-us',
    element:<AboutUs/>
  },
  {
    path:'/update-vehicle/:id',
    element: <UpdateVehicle/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  </StrictMode>,
)
