import { Outlet } from 'react-router-dom';
import Logo from '../logo/Logo';
import NavbarsPage from '../navbars/NavbarsPage';

const GeneralLayout = () => (
  <>
    <Logo />
    <NavbarsPage />
    <Outlet />
  </>
);

export default GeneralLayout;
