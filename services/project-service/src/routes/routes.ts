import getProjects from '../controllers/getProject';
import addProject from '../controllers/addProject';
import updateProject from '../controllers/updateProject';
import deleteProject from '../controllers/deleteProject';

export default (app) => {
    app.get('/projects', getProjects);
    app.post('/projects', addProject);
    app.put('/projects/:id', updateProject);
    app.delete('/projects/:id', deleteProject);
};
