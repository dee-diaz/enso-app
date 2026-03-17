import List from './List';
import StorageInterface from '../infrastructure/StorageInterface';

class ListManager {
  lists: List[];

  constructor(private storage: StorageInterface) {
    this.lists = this.loadLists();
  }

  loadLists(): List[] {
    const lists = this.storage.get<List[]>('lists');
    return lists ?? [];
  }

  getLists(): List[] {
    return this.lists;
  }

  getList(listId: string): List | undefined {
    return this.lists.find((list) => list._id === listId);
  }

  saveList(title: string, color: string): List {
    const newList = new List(title, color);
    this.lists.push(newList);
    this.storage.save('lists', this.lists);

    return newList;
  }

  deleteList(listId: string): List | null {
    const index = this.lists.findIndex((list) => list._id === listId);
    if (index === -1) return null;

    const deletedList = this.lists.splice(index, 1)[0];
    this.storage.save('lists', this.lists);

    return deletedList;
  }
}

export default ListManager;
