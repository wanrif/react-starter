import { useAppDispatch, useAppSelector } from '@app/hooks';
import { setTheme } from '@app/reducer';
import { selectTheme } from '@app/selectors';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import ClientRoutes from '@routes/index';

const App = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    if (theme === 'dark' || (isEmpty(theme) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      dispatch(setTheme('dark'));
      document.documentElement.classList.add('dark');
    } else {
      dispatch(setTheme('light'));
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className='antialiased scroll-smooth'>
      <ClientRoutes />
    </div>
  );
};

export default App;
