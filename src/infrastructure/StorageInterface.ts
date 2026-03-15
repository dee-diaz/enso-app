/**
 * An abstract interface for storage adapters
 */

abstract class StorageInterface {
  abstract get(key: string): unknown | null;

  abstract save(key: string, value: unknown): void;

  abstract remove(key: string): void;
}

export default StorageInterface;
