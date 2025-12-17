import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Capture from './Capture';
import Login from './Login';
import Register from './Register';
import RequireAuth from '../components/RequireAuth';

export const appPaths = {
    HOME: "/",
    CAPTURE: "/capture",
    LOGIN: "/login",
    REGISTER: "/register"
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={appPaths.LOGIN} element={<Login />} />
      <Route path={appPaths.REGISTER} element={<Register />} />
      <Route path={appPaths.HOME} element={<Home />} />
      <Route element={<RequireAuth />}>
        <Route path={appPaths.CAPTURE} element={<Capture />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

