import useUserStore from "@/store/features/user"
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const { isLoggedIn } = useUserStore();
  const location = useLocation();

  if(!isLoggedIn())
    return <Navigate to={'/'} state={{from: location}} />

  return (
    <Outlet/>
  )
}

export default RequireAuth