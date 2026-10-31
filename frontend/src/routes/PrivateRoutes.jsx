import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoutes = ({allowRoles}) => {
  return <Outlet />
}

export default PrivateRoutes