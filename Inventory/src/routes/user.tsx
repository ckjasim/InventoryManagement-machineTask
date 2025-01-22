import { Navigate, Route, Routes } from 'react-router-dom';




import BrickLoader from '../components/brickLoader';
// import NotFound from '../Usercomponents/notFound';
import { lazy ,Suspense, useEffect, useState} from 'react';
import { currentUser } from '../Api/user';




const Login =lazy(()=>import('../pages/login'))

const Home =lazy(()=>import('../pages/dashboard')) 

const UserRouter = () => {
//   const currentUser = useGetUser();
const [user,setUser]=useState<any>()
useEffect(()=>{
  const fetchTheData= async()=>{

   const response=  await currentUser()
      console.log(response)
      if(!response.currentUser){
        setUser(false)
      }else{
        setUser(true)
      }
  }
  fetchTheData()
},[user])

  return (
    <>
      <Suspense fallback={<BrickLoader />}>
      <Routes>
        <Route path='/*' element={user?<Home />:<Navigate to={'/login'}/>} />
        <Route path='/login' element={!user?<Login/>:<Navigate to={'/'}/>}/>

      
      </Routes>
        </Suspense>
    </>
  );
};

export default UserRouter;
