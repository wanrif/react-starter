import type { RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectIsAuthenticated } from '@pages/Login/selectors';
import { logoutSuccess } from '@pages/Login/reducer';

import Theme from '@components/Theme';
import Locale from '@components/Locale';

interface Props {
  headerRef: RefObject<HTMLDivElement>;
}

const Navbar = ({ headerRef }: Props) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navbarLinks = new Set([
    {
      name: 'navbar_home',
      link: '/',
    },
    {
      name: 'navbar_about',
      link: '/about',
    },
    {
      name: 'navbar_quiz_hub',
      link: '/quiz-hub',
    },
    {
      name: 'navbar_chat',
      link: '/chat',
    },
  ]);

  const handleLogout = () => {
    dispatch(logoutSuccess());
  };

  return (
    <div
      ref={headerRef}
      className='w-full bg-white shadow-sm dark:bg-primary-200 text-primary-200 dark:text-primary-50'>
      <div className='flex items-center container mx-auto justify-between  py-4 px-4 lg:px-28'>
        <div className='text-xl font-medium cursor-pointer' onClick={() => navigate('/')}>
          Navbar
        </div>
        <div className='flex items-center gap-4'>
          {[...navbarLinks].map((item) => (
            <button
              key={item.link}
              type='button'
              className='font-medium cursor-pointer'
              onClick={() => navigate(item.link)}>
              {t(item.name)}
            </button>
          ))}
          <Theme />
          <Locale />
          {isAuthenticated ? (
            <button type='button' className='font-medium cursor-pointer' onClick={handleLogout}>
              {t('navbar_logout')}
            </button>
          ) : (
            <button type='button' className='font-medium cursor-pointer' onClick={() => navigate('/login')}>
              {t('navbar_login')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
