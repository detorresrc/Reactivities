import useUserStore from "@/store/features/user";
import { useEffect } from "react"

const RefreshToken = () => {
  const { user, startRefreshToken } = useUserStore();
  useEffect(() => {
    if(user){
      startRefreshToken();
    }
  }, []);
  
  return (
    <></>
  )
}

export default RefreshToken