import React from 'react';
import MainLayout, { type MainLayoutProps } from '@layouts/MainLayout';
import LandingPage from '@pages/LandingPage';
import NotFound from '@pages/NotFound';
import Chatting from '@pages/Chatting';
import Login from '@pages/Login';

// Define a type for your route
interface RouteConfig {
  path: string;
  name: string;
  protected?: boolean;
  component?: React.FC;
  subRoutes?: RouteConfig[];
  layout?: React.FC<MainLayoutProps>;
  header?: boolean;
}

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Main Layout',
    protected: false,
    layout: MainLayout,
    subRoutes: [
      {
        path: '/',
        name: 'Landing Page',
        component: LandingPage,
        header: true,
      },
      {
        path: '/chat',
        name: 'Chatting Page',
        protected: true,
        component: Chatting,
        header: true,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login Page',
    protected: false,
    component: Login,
  },
  {
    path: '*',
    name: 'Not Found',
    protected: false,
    component: NotFound,
  },
];

export default routes;
