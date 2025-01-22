import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import {store,persistor} from './redux/storage.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast';
ReactDOM.createRoot(document.getElementById('root')!).render(

     <Provider store={store}>
      <PersistGate persistor={persistor}>
      
    <BrowserRouter>
    <Toaster/>
    <App />
    </BrowserRouter>
        
        </PersistGate>
     </Provider>

)
