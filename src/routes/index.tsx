import { useRoutes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import CustomerList from '../pages/CustomerList'
import TaskList from '../pages/TaskList'
import Pipeline from '../pages/Pipeline'
import ProductList from '../pages/ProductList'
import InvoiceList from '../pages/InvoiceList'
import LoginPage from '../pages/LoginPage'
import PrivateRoute from '../components/PrivateRoute'

export default function Router() {
  const routes = useRoutes([
    { path: '/login', element: <LoginPage /> },
    {
      path: '/',
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: '/customers',
      element: (
        <PrivateRoute>
          <CustomerList />
        </PrivateRoute>
      ),
    },
    {
      path: '/tasks',
      element: (
        <PrivateRoute>
          <TaskList />
        </PrivateRoute>
      ),
    },
    {
      path: '/pipeline',
      element: (
        <PrivateRoute>
          <Pipeline />
        </PrivateRoute>
      ),
    },
    {
      path: '/products',
      element: (
        <PrivateRoute>
          <ProductList />
        </PrivateRoute>
      ),
    },
    {
      path: '/invoices',
      element: (
        <PrivateRoute>
          <InvoiceList />
        </PrivateRoute>
      ),
    },
  ])

  return routes
}