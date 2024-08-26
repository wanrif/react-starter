import { useCallback } from 'react';
import { BsFillMoonStarsFill, BsSunFill } from 'react-icons/bs';

import { setThemeWithCallbacks } from '@app/actions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectTheme } from '@app/selectors';

const Theme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(
      setThemeWithCallbacks({
        theme: newTheme,
        cbSuccess: () => document.documentElement.classList.toggle('dark'),
      })
    );
  }, [theme]);

  return (
    <div className='flex items-center gap-2'>
      <button type='button' onClick={toggleTheme}>
        {theme === 'dark' ? <BsFillMoonStarsFill /> : <BsSunFill />}
      </button>
    </div>
  );
};

export default Theme;
