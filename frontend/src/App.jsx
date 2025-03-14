import RootLayout from "./RootLayout";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import Home from "./components/home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import OwnerDashboard from "./components/ownerDashboard/OwnerDashboard";
import TenantDashboard from "./components/tenantDashboard/TenantDashboard";
import ViewProfile from "./components/viewProfile/ViewProfile";
import EditProfile from "./components/editProfile/EditProfile";
import AddHouse from "./components/addHouse/AddHouse";
import ViewHouse from "./components/viewHouse/ViewHouse";
import EditHouse from "./components/editHouse/EditHouse";
import BrowseHouses from "./components/browseHouses/BrowseHouses";
import './App.css';

function App(){
  const browserRouter=createBrowserRouter([
    {
      path:'',
      element:<RootLayout />,
      children:[
        {
          path:'',
          element:<Home />
        },
        {
          path:'register',
          element:<Register />
        },
        {
          path:'login',
          element:<Login />
        },
        {
          path:'ownerDashboard',
          element:<OwnerDashboard />
        },
        {
          path:'tenantDashboard',
          element:<TenantDashboard />
        },
        {
          path:'viewProfile',
          element:<ViewProfile />
        },
        {
          path:'editProfile',
          element:<EditProfile />
        },
        {
          path:'addHouse',
          element:<AddHouse />
        },
        {
          path:'viewHouse',
          element:<ViewHouse />
        },
        {
          path:'editHouse',
          element:<EditHouse />
        },{
          path:'browseHouses',
          element:<BrowseHouses />
        }
      ]
    }
  ])
  return(
    <RouterProvider router={browserRouter} />
  )
}

export default App