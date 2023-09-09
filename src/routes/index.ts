import { Express } from "express";
import authRouter from './auth';
import userRouter from './user';
import groupRouter from './group';
import categoryRouter from './category';
import productRouter from './product';
import orderRouter from './order';
import voucherRouter from './voucher';
export default function route(app: Express) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/groups', groupRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/products', productRouter);
    app.use('/api/orders', orderRouter);
    app.use('/api/vouchers', voucherRouter);
}