import { Route, Routes } from 'react-router-dom';

import UserRouter from './routes/user';


function App() {
 
  return (
    <>
     <Routes>
      <Route path='/*' element={<UserRouter/>}/>
      
    </Routes>
      
    </>
  );
}

export default App;
