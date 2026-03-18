// localStorage implementation
import StorageInterface from './StorageInterface';

class LocalStorageAdapter extends StorageInterface {
  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  save<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export default LocalStorageAdapter;
