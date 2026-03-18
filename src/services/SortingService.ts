// All sorting logic
import type Task from '../domain/Task';

class SortingService {
  static sortByPriority(tasks: Task[]): Task[] {
    const order: Record<string, number> = {
      high: 1,
      medium: 2,
      low: 3,
    };

    return [...tasks].sort((a, b) => {
      const getPriorityValue = (p?: string): number =>
        order[p?.toLowerCase() ?? ''] ?? 4;

      return getPriorityValue(a.priority) - getPriorityValue(b.priority);
    });
  }
}

export default SortingService;
