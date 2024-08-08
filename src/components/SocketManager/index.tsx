import Button from '@components/Button';
import socket from '@utils/socket';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ConnectionManager() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(socket.connected);

  function connect() {
    socket.connect();
    setIsConnected(true);
  }

  function disconnect() {
    socket.disconnect();
    setIsConnected(false);
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className='w-72 flex flex-col gap-3 text-center border-2 border-primary-50 p-5 rounded-xl'>
      {isConnected ? (
        <div className='text-2xl uppercase'>{t('connected')}</div>
      ) : (
        <div className='text-2xl uppercase'>{t('disconnected')}</div>
      )}
      <Button onClick={connect} text='Connect' />
      <Button onClick={disconnect} text='Disconnect' />
    </div>
  );
}
