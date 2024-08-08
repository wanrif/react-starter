import { useGetPingQuery } from '@app/reducer';
import { ConnectionManager } from '@components/SocketManager';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  headerHeight?: number;
}

const LandingPage = ({ headerHeight = 0 }: Props) => {
  const { t } = useTranslation();
  const { data, error, isLoading } = useGetPingQuery({});

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <main
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
      className='flex flex-col items-center justify-center'>
      <div className='text-2xl'>{t('welcome')}</div>
      <div className='text-2xl'>{isLoading ? 'loading...' : data?.message}</div>

      <ConnectionManager />
    </main>
  );
};

export default LandingPage;
