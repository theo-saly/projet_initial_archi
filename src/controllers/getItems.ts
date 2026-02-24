import db from '../persistence';

export default async (req, res) => {
    const items = await db.getItems();
    res.send(items);
};
