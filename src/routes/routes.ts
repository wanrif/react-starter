import React from 'react';
import MainLayout, { type MainLayoutProps } from '@layouts/MainLayout';
import LandingPage from '@pages/LandingPage/loadable';
import NotFound from '@pages/NotFound/loadable';
import Chatting from '@pages/Chatting/loadable';
import Login from '@pages/Login/loadable';
import QuizHub from '@pages/QuizHub/loadable';

// Define a type for your route
interface RouteConfig {
  path: string;
  name: string;
  protected?: boolean;
  component?: React.ComponentType<any>;
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
      {
        path: '/quiz-hub',
        name: 'Quiz Hub Page',
        protected: true,
        component: QuizHub,
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
