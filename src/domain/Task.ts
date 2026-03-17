import { format } from 'date-fns';

// Task model, basic task operations
class Task {
  _id: number | string;
  _creationDate: string;
  completed: boolean;
  title: string;
  description?: string;
  scheduleDate?: string;
  deadlineDate?: string;
  priority?: string;
  lists: string[];

  constructor(
    title: string,
    description: string = '',
    scheduleDate: string = '',
    deadlineDate: string = '',
    priority: string = '',
    id?: string,
  ) {
    this._id = id ?? crypto.randomUUID();
    this._creationDate = createDate();
    this.completed = false;
    this.title = title;
    this.description = description;
    this.scheduleDate = scheduleDate;
    this.deadlineDate = deadlineDate;
    this.priority = priority;
    this.lists = ['All tasks'];
  }
}

export function createDate(): string {
  const now = new Date();
  return format(now, 'dd/MM/yyyy');
}

export default Task;
