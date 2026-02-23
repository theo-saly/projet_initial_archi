import getItems from '../controllers/getItems';
import addItem from '../controllers/addItem';
import updateItem from '../controllers/updateItem';
import deleteItem from '../controllers/deleteItem';
import authRouter from './auth';

export default (app) => {
    app.get('/items', getItems);
    app.post('/items', addItem);
    app.put('/items/:id', updateItem);
    app.delete('/items/:id', deleteItem);
    app.use('/auth', authRouter);
};
