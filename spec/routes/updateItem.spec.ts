import db from '../../src/persistence';
import updateItem from '../../src/controllers/updateItem';

const ITEM = { id: 12345 };

jest.mock('../../src/persistence', () => ({
    getItem: jest.fn(),
    updateItem: jest.fn(),
}));

test('it updates items correctly', async () => {
    const req = {
        params: { id: 1234 },
        body: { name: 'New title', completed: false },
    };
    const res = { send: jest.fn() };

    (db.getItem as jest.Mock).mockReturnValue(Promise.resolve(ITEM));

    await updateItem(req, res);

    expect((db.updateItem as jest.Mock).mock.calls.length).toBe(1);
    expect((db.updateItem as jest.Mock).mock.calls[0][0]).toBe(req.params.id);
    expect((db.updateItem as jest.Mock).mock.calls[0][1]).toEqual({
        name: 'New title',
        completed: false,
    });

    expect((db.getItem as jest.Mock).mock.calls.length).toBe(1);
    expect((db.getItem as jest.Mock).mock.calls[0][0]).toBe(req.params.id);

    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(ITEM);
});
