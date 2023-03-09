import express, {Express} from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import {BearerStrategy, IBearerStrategyOptionWithRequest, ITokenPayload} from 'passport-azure-ad';
import passport from 'passport';

dotenv.config();

import {prisma} from './datasource/connectDB';
import router from './routes';
import {errorHandler} from './middleware/errorHandler';

prisma.$connect().then(() => {
    console.log('DB connected');
});

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Azure token verification initialization
app.use(passport.initialize());
const options: IBearerStrategyOptionWithRequest = {
    identityMetadata: `${process.env.CLOUD_INSTANCE}${process.env.TENANT_ID}/${process.env.IDENTITY_VERSION}/${process.env.IDENTITY_DISCOVERY}`,
    clientID: process.env.CLIENT_ID as string,
    audience: process.env.CLIENT_ID as string,
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: 'error',
    scope: ['Usr.Read']
};
const bearerStrategy = new BearerStrategy(options, (token: ITokenPayload, done: CallableFunction) => done(null, {}, token));
passport.use(bearerStrategy);

const port = process.env.PORT || 8000;

// Routes
app.use('/api', router);

// Error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`
    ################################################
          Server is running at http://localhost:${port}
    ################################################
  `);
}).on('error', (err: Error) => {
    console.error(err);
    process.exit(1);
});
