/**
 * An abstract interface for storage adapters
 */

abstract class StorageInterface {
  abstract get<T>(key: string): T | null;

  abstract save<T>(key: string, value: T): void;

  abstract remove(key: string): void;
}

export default StorageInterface;
