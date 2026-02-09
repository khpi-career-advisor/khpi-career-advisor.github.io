class LocalStorageCollection {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    addNew(item) {
        const items = this.getAll();
        const id = this._generateId(items);
        const newItem = { id, ...item, createdAt: new Date().toISOString() };

        items.push(newItem);
        this._save(items);

        return newItem;
    }

    getAll() {
        const data = localStorage.getItem(this.collectionName);
        return data ? JSON.parse(data) : [];
    }

    getById(id) {
        const items = this.getAll();
        return items.find(item => item.id === id) || null;
    }

    update(id, updates) {
        const items = this.getAll();
        const index = items.findIndex(item => item.id === id);

        if (index === -1) return null;

        items[index] = {...items[index], ...updates, updatedAt: new Date().toISOString() };
        this._save(items);

        return items[index];
    }

    delete(id) {
        const items = this.getAll();
        const filtered = items.filter(item => item.id !== id);

        if (filtered.length === items.length) return false;

        this._save(filtered);
        return true;
    }

    clear() {
        localStorage.removeItem(this.collectionName);
    }

    _save(items) {
        localStorage.setItem(this.collectionName, JSON.stringify(items));
    }

    _generateId(items) {
        if (items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    }
}