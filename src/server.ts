import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoute';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { userRouter } from './routes/userRoute';
import { commentsRouter } from './routes/commentsRoute';
import { postRouter } from './routes/postRoute';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;
const origin = process.env.CLIENT_URL as string;

const app = express();

app.use(cors({
  origin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use(authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentsRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
