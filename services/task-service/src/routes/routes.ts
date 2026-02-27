import getItems from '../controllers/getTask';
import addItem from '../controllers/addTask';
import updateItem from '../controllers/updateTask';
import deleteItem from '../controllers/deleteTask';

export default (app) => {
    app.get('/tasks', getItems);
    app.post('/tasks', addItem);
    app.put('/tasks/:id', updateItem);
    app.delete('/tasks/:id', deleteItem);
};
