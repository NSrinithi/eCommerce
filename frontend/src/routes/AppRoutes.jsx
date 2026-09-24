import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { ProtectedRoute, GuestRoute,RequiredRole } from './ProtectedRoute.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';
import { DashboardPage } from '../pages/dashboard/DashboardPage.jsx';
import { ExamplesPage } from '../pages/examples/ExamplesPage.jsx';
import { ProfilePage } from '../pages/profile/ProfilePage.jsx';
import { SettingsPage } from '../pages/settings/SettingsPage.jsx';
import { CartPage } from '../pages/cart/CartPage.jsx';
import { ProductsPage } from '../pages/products/ProductsPage.jsx';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.jsx';
import { AddProductPage } from '../pages/admin/AddProductPage.jsx';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage.jsx';
import { EditProductPage } from '../pages/admin/EditProductPage.jsx';
import { OrdersPage } from '../pages/orders/OrdersPage.jsx';
import { CheckOutPage } from '../pages/checkout/CheckOutPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
export function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Route>
    
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path='/orders' element={<OrdersPage/>}/>
        <Route path='/admin/dashboard' element={<RequiredRole role="ADMIN"><AdminDashboardPage/></RequiredRole>}/>
        <Route path='/admin/products' element={<RequiredRole role="ADMIN"><AdminProductsPage/></RequiredRole>}/>
        <Route path='/admin/add' element={<RequiredRole role="ADMIN"><AddProductPage/></RequiredRole>}/>
        <Route path='/admin/edit/:id' element={<RequiredRole role="ADMIN"><EditProductPage/></RequiredRole>}/>
        <Route path='/checkOut' element={<CheckOutPage/>}/>
        <Route path='/cart' element={<CartPage/>}/>
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
