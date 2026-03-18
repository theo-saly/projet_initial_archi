import getTasks from '../controllers/getTask';
import getTasksByProject from '../controllers/getTasksByProject';
import addTask from '../controllers/addTask';
import updateTask from '../controllers/updateTask';
import deleteTask from '../controllers/deleteTask';

export default (app) => {
    app.get('/tasks', getTasks);
    app.get('/tasks/by-project', getTasksByProject);
    app.post('/tasks', addTask);
    app.put('/tasks/:id', updateTask);
    app.delete('/tasks/:id', deleteTask);
};
