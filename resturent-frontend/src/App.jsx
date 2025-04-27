import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import RestarentDashboard from "./components/RestaurentDashboard/RestarentDashboard";
import RegisterPage from "./components/Register/RegisterPage";
import CustomerDashboard from "./components/CustomerDashboard/CustomerDashboard";
import SingleRestaurant from "./components/SingleRetaurant/SingleRestaurant";
import Cart from "./components/Cart/Cart";
import Profile from "./components/Profile/Profile";
import CheckoutScreen from "./components/CheckoutScreen/CheckoutScreen";
import OrderConfirmation from "./components/OrderConfirmation/OrderConfirmation";
import MyOrders from "./components/MyOrders/MyOrders";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<Login />} path="/" />
        <Route element={<RestarentDashboard />} path="/restaurent-dashboard" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<CustomerDashboard />} path="/customer-dashboard" />
        <Route element={<SingleRestaurant />} path="/restaurant/:id" />
        <Route element={<Cart />} path="/cart/:restaurantId" />
        <Route element={<Profile />} path="/profile" />
        <Route element={<CheckoutScreen />} path="/checkout/:restaurantId" />
        <Route element={<OrderConfirmation />} path="/order-confirmation" />
        <Route element={<MyOrders />} path="/my-orders" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
