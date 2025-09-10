import React,{useContext, useState} from 'react'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

const {currency}=useContext(AppContext)
const [dashboard,setdashboard]=useState(null)


  return (
    <div>
        <h1>Eductaor Dashboard</h1>
    </div>
  )
}

export default Dashboard;