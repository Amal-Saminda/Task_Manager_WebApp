import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Login from "../src/modules/auth/components/LoginForm"
import SingUp from "../src/modules/auth/pages/SignupPage"
import PrivateRoutes from './routes/PrivateRoutes'
import Dashboard from './pages/Admin/Dashboard'
import ManageTask from './pages/Admin/ManageTask'
import CreateTask from './pages/Admin/CreateTask'
import ManageUser from './pages/Admin/ManageUser'
import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import ViewTaskDetails from './pages/User/ViewTaskDetails'

function App() {
  return (
    
      <BrowserRouter>
      
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/SingUp' element={<SingUp />} />

          
          <Route element={<PrivateRoutes allowRoles={["admin"]} />} >
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/tasks' element={<ManageTask />} />
          <Route path='/admin/create-task' element={<CreateTask />} />
          <Route path='/admin/users' element={<ManageUser />} />
          </Route>
          
          <Route element={<PrivateRoutes allowRoles={["admin"]} />} >
          <Route path='/user/dashboard' element={<UserDashboard />} />
          <Route path='/user/my-tasks' element={<MyTasks />} />
          <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
          </Route>

        </Routes>
      
      </BrowserRouter>
    
  )
}

export default App