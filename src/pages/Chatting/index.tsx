import { useCallback, useEffect, useRef, useState, type Key } from 'react';
import { setContacts } from './reducer';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { doGetContacts } from './thunk';
import { selectAccessToken } from '@pages/Login/selectors';

import socket, { connectSocket } from '@utils/socket';

interface IChatting {
  headerHeight?: number;
}

interface IContact {
  _id: string;
  name: string;
  email: string;
}

interface IMessage {
  sender: string;
  content: string;
  timestamp: number;
}

const Chatting = ({ headerHeight = 0 }: IChatting) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAccessToken);
  // const { data, error } = useGetContactsQuery([]);
  const contactList = useAppSelector((state) => state.chatting.contacts);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // if (error) {
  //   console.error(error);
  // }

  const fetchData = async () => {
    try {
      const response = await dispatch(doGetContacts()).unwrap();
      dispatch(setContacts(response.contactList));
    } catch (error) {
      console.error('error ->', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    } else {
      socket.disconnect();
    }

    socket.on('chatHistory', (history: IMessage[]) => {
      setMessages(history);
    });

    socket.on('newMessage', (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('newMessage');
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpenChat = useCallback((contact: IContact) => {
    setSelectedContact(contact);
    socket.emit('openChat', contact.email);
  }, []);

  const sendMessage = () => {
    if (message.trim() && selectedContact) {
      socket.emit('sendMessage', { userEmail: selectedContact.email, message });
      setMessage('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedContact(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{ minHeight: `calc(100vh - ${headerHeight}px - 40px)` }}
      className='m-5 dark:bg-primary-200 rounded-md dark:border-primary-100 border border-slate-200 flex flex-col'>
      <div className='flex flex-1'>
        <div className='shrink w-72'>
          <div className='flex items-center justify-between p-4 border-b border-slate-200 dark:border-primary-100'>
            <div className='text-lg font-medium'>Chat</div>
            <div className='flex gap-4'>
              <button type='button' className='font-medium cursor-pointer'>
                All
              </button>
              <button type='button' className='font-medium cursor-pointer'>
                Unread
              </button>
            </div>
          </div>
          <div
            style={{ maxHeight: `calc(100vh - ${headerHeight}px - 103px)`, scrollbarWidth: 'none' }}
            className='overflow-y-auto scroll-smooth'>
            {contactList &&
              contactList.map((contact: IContact, index: Key) => (
                <div
                  key={index}
                  onClick={() => handleOpenChat(contact)}
                  className='p-4 border-b border-slate-200 dark:border-primary-100 cursor-pointer
                group hover:bg-slate-200 dark:hover:bg-primary-100 transition-colors
                '>
                  <div className='flex items-center gap-4'>
                    <div
                      className='w-12 h-12 rounded-full bg-slate-200 dark:bg-primary-100
                  group-hover:bg-amber-500 transition-colors
                  '></div>
                    <div className='flex flex-col'>
                      <div className='text-lg font-medium dark:text-amber-500'>{contact?.name}</div>
                      <div className='text-sm text-slate-400'>{contact?.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            <div className='p-4 text-xs'>
              Your personal message are end-to-end encrypted and can only be read by you and the recipient.
            </div>
          </div>
        </div>
        <div
          className='flex-1 border-l border-slate-200 dark:border-primary-100 rounded-tl-2xl rounded-bl-2xl overflow-hidden'
          style={{ maxHeight: `calc(100vh - ${headerHeight}px - 30px)`, scrollbarWidth: 'none' }}>
          <div
            className='flex flex-col h-full'
            style={{ maxHeight: `calc(100vh - ${headerHeight}px - 70px)`, scrollbarWidth: 'none' }}>
            <div
              id='headerChat'
              className='p-5 rounded-tl-2xl rounded-tr-md bg-slate-200
            dark:bg-primary-200 border-b border-slate-200 dark:border-primary-100 dark:text-primary-50
            '>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-amber-500'></div>
                <div className='flex flex-col'>
                  <div className='text-lg font-medium'>
                    {selectedContact?.name || 'Select a contact to start chatting'}
                  </div>
                  <div className='text-sm text-slate-400'>
                    {selectedContact?.email || 'Your messages are end-to-end encrypted'}
                  </div>
                </div>
              </div>
            </div>
            <div
              id='content'
              className='h-[100%] overflow-y-auto scroll-smooth scroll'
              style={{ scrollbarWidth: 'none' }}>
              <div className='p-5'>
                <div className='flex flex-col gap-2 relative'>
                  {messages.map((msg: IMessage, index: Key) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === selectedContact?.email ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`p-2 ${
                          msg.sender === selectedContact?.email
                            ? 'bg-slate-200 text-slate-900 rounded-tr-2xl rounded-bl-2xl'
                            : 'bg-amber-500 text-white rounded-tl-2xl rounded-br-2xl'
                        }`}>
                        {msg.content}
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender === selectedContact?.email ? 'text-slate-700' : 'text-white'
                          }`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
            <div id='message' className='h-[10%]'>
              <div className='flex items-center gap-4 p-5'>
                <input
                  type='text'
                  placeholder='Type a message...'
                  className='flex-1 p-2 border-2 border-slate-200 dark:border-primary-100 rounded-xl'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} type='button' className='p-2 bg-amber-500 text-white rounded-xl'>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
