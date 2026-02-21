const getItems = require('../controllers/getItems');
const addItem = require('../controllers/addItem');
const updateItem = require('../controllers/updateItem');
const deleteItem = require('../controllers/deleteItem');

module.exports = (app) => {
    app.get('/items', getItems);
    app.post('/items', addItem);
    app.put('/items/:id', updateItem);
    app.delete('/items/:id', deleteItem);
};
