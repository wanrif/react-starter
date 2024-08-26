import { loginApi } from '@pages/Login/reducer';
import { appApi } from '../app/reducer';
import { chattingApi } from '@pages/Chatting/reducer';

const apiMiddleware = [appApi.middleware, loginApi.middleware, chattingApi.middleware];

export default apiMiddleware;
