import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectIsAuthenticated } from '@pages/Login/selectors';
import Theme from '@components/Theme';
import Locale from '@components/Locale';
import { logoutSuccess } from '@pages/Login/reducer';

const NotFound = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const header = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (header.current) {
      setHeaderHeight(header.current.clientHeight);
    }
  }, [header.current?.clientHeight]);

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

  const handleNavigate = useCallback(
    (link: string) => {
      navigate(link);
    },
    [navigate]
  );

  const handleLogout = () => {
    dispatch(logoutSuccess());
  };

  return (
    <div className='flex flex-col'>
      <div ref={header} className='w-full bg-white shadow-sm dark:bg-primary-200 text-primary-200 dark:text-primary-50'>
        <div className='flex items-center container mx-auto justify-between py-4 px-4 lg:px-28'>
          <div className='text-xl font-medium cursor-pointer' onClick={() => navigate('/')}>
            Navbar
          </div>
          <div className='flex items-center gap-4'>
            {[...navbarLinks].map((item) => (
              <button
                key={item.link}
                type='button'
                className='font-medium cursor-pointer'
                onClick={() => handleNavigate(item.link)}>
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

      <section
        style={{ minHeight: `calc(100dvh - ${headerHeight}px)` }}
        className='flex items-center justify-center text-4xl font-bold bg-slate-50 dark:bg-primary-300 text-primary-200 dark:text-primary-50'>
        {t('not_found')}
      </section>
    </div>
  );
};

export default NotFound;
