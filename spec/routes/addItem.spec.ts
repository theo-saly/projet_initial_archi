import db from '../../src/persistence';
import addItem from '../../src/controllers/addItem';
import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

test('it stores item correctly', async () => {
    const id = 'something-not-a-uuid';
    const name = 'A sample item';
    const req = { body: { name } };
    const res = { send: jest.fn() };

    (uuid as jest.Mock).mockReturnValue(id);

    await addItem(req, res);

    const expectedItem = { id, name, completed: false };

    expect((db.storeItem as jest.Mock).mock.calls.length).toBe(1);
    expect((db.storeItem as jest.Mock).mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});
