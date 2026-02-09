const app = {
        collection: null,
        currentCollectionName: '',
        editingId: null,

        init() {
            this.loadCollectionsList();
            this.setupEventListeners();
        },

        setupEventListeners() {
            document.getElementById('collectionSelect').addEventListener('change', (e) => {
                this.loadCollection(e.target.value);
            });

            document.getElementById('searchInput').addEventListener('input', (e) => {
                this.filterItems(e.target.value);
            });
        },

        loadCollectionsList() {
            const select = document.getElementById('collectionSelect');
            const collections = new Set();

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (Array.isArray(data)) {
                        collections.add(key);
                    }
                } catch (e) {}
            }

            select.innerHTML = '<option value="">Select collection</option>';
            collections.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        },

        loadCollection(name) {
            if (!name) {
                this.showEmptyState();
                return;
            }

            this.currentCollectionName = name;
            this.collection = new LocalStorageCollection(name);
            this.renderItems();
        },

        renderItems(items = null) {
            const data = items || this.collection.getAll();
            const content = document.getElementById('content');

            this.updateStats(data);

            if (data.length === 0) {
                content.innerHTML = `
            <div class="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <p>Collection is empty</p>
            </div>
          `;
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'item-grid';

            data.forEach(item => {
                const card = this.createItemCard(item);
                grid.appendChild(card);
            });

            content.innerHTML = '';
            content.appendChild(grid);
        },

        createItemCard(item) {
            const card = document.createElement('div');
            card.className = 'item-card';

            const {
                id,
                createdAt,
                updatedAt,
                ...dataOnly
            } = item;

            card.innerHTML = `
          <div class="item-header">
            <div class="item-id">ID: ${id}</div>
            <div class="item-actions">
              <button onclick="app.editItem(${id})">Edit</button>
              <button class="delete" onclick="app.deleteItem(${id})">Delete</button>
            </div>
          </div>
          <div class="item-data">
            <pre>${JSON.stringify(dataOnly, null, 2)}</pre>
          </div>
          <div class="item-meta">
            Created: ${new Date(createdAt).toLocaleString()}
            ${updatedAt ? `<br>Updated: ${new Date(updatedAt).toLocaleString()}` : ''}
          </div>
        `;

        return card;
    },

    updateStats(data) {
        const stats = document.getElementById('stats');
        const sizeBytes = new Blob([JSON.stringify(data)]).size;
        const sizeKB = (sizeBytes / 1024).toFixed(2);

        stats.textContent = `Collection: ${this.currentCollectionName} | Items: ${data.length} | Size: ${sizeKB} KB`;
    },

    filterItems(searchTerm) {
        if (!this.collection) return;

        const allItems = this.collection.getAll();

        if (!searchTerm.trim()) {
            this.renderItems(allItems);
            return;
        }

        const filtered = allItems.filter(item => {
            const itemStr = JSON.stringify(item).toLowerCase();
            return itemStr.includes(searchTerm.toLowerCase());
        });

        this.renderItems(filtered);
    },

    addNewItem() {
        if (!this.collection) {
            alert('Please select a collection');
            return;
        }

        this.editingId = null;
        document.getElementById('modalTitle').textContent = 'Add Item';
        document.getElementById('itemData').value = '{\n  \n}';
        document.getElementById('modal').classList.add('active');
    },

    editItem(id) {
        this.editingId = id;
        const item = this.collection.getById(id);
        const { id: itemId, createdAt, updatedAt, ...dataOnly } = item;

        document.getElementById('modalTitle').textContent = `Edit Item #${id}`;
        document.getElementById('itemData').value = JSON.stringify(dataOnly, null, 2);
        document.getElementById('modal').classList.add('active');
    },

    saveItem() {
        const dataText = document.getElementById('itemData').value;

        try {
            const data = JSON.parse(dataText);

            if (this.editingId !== null) {
                this.collection.update(this.editingId, data);
            } else {
                this.collection.addNew(data);
            }

            this.closeModal();
            this.renderItems();
        } catch (e) {
            alert('JSON Error: ' + e.message);
        }
    },

    deleteItem(id) {
        if (!confirm(`Delete item #${id}?`)) return;

        this.collection.delete(id);
        this.renderItems();
    },

    clearCollection() {
        if (!this.collection) return;

        if (!confirm(`Delete all items from collection "${this.currentCollectionName}"?`)) return;

        this.collection.clear();
        this.renderItems();
    },

    downloadCollection() {
        if (!this.collection) {
            alert('Please select a collection');
            return;
        }

        const items = this.collection.getAll();

        const exportData = {
            collection: this.currentCollectionName,
            exportedAt: new Date().toISOString(),
            count: items.length,
            items: items
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentCollectionName}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    },

    refreshData() {
        if (!this.collection) return;
        this.renderItems();
    },

    closeModal() {
        document.getElementById('modal').classList.remove('active');
        this.editingId = null;
    },

    showEmptyState() {
        const content = document.getElementById('content');
        const stats = document.getElementById('stats');

        stats.textContent = 'Select a collection to view';
        content.innerHTML = `
          <div class="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p>Select a collection to view</p>
          </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});