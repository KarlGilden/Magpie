import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Capture from './Capture';

export const appPaths = {
    HOME: "/",
    CAPTURE: "/capture"
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={appPaths.HOME} element={<Home />} />
      <Route path={appPaths.CAPTURE} element={<Capture />} />
    </Routes>
  );
};

export default AppRoutes;

