import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import SIOPRoute from './routes/siop.route';

validateEnv();

const app = new App([new IndexRoute(), new SIOPRoute()]);

app.listen();
