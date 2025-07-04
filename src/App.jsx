import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Form from './pages/form'

function App() {
  const [count, setCount] = useState(0)
    //  const backgroundImage =  { background: "radial-gradient(90deg,rgb(68, 15, 122),rgb(214, 169, 233))" };

  return (

   <div className=" items-center overflow-x-hidden flex w-full "
  style= {{ background: "radial-gradient(90deg,rgb(201, 159, 243),rgb(82, 31, 104))" }}>
    <Form/>
   </div>

  )
}

export default App
