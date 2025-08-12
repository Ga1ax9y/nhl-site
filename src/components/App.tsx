import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './App.scss'
import Header from './layout/header/Header'
import Teams from '../pages/Teams';
import Schedule from '../pages/Schedule';
import Standings from '../pages/Standings';
import Roster from '../pages/Roster';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import PlayerInfo from '../pages/PlayerInfo';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/teams',
        element: <Teams />,
      },
      {
        path: '/schedule',
        element: <Schedule />,
      },
      {
        path: '/standings',
        element: <Standings />,
      },
      {
        path: '/roster/:teamAbbrev',
        element: <Roster />,
      },
      {
        path: 'player/:playerId',
        element: <PlayerInfo />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />
}

export default App
