// CRUD operations, data management
import Task from './Task';
import { DEFAULT_LISTS } from '../utils/Constants';
import { format } from 'date-fns';
import StorageInterface from '../infrastructure/StorageInterface';
import ListManager from './ListManager';
import { TaskFormValues } from '../types/formValues';

class TaskManager {
  tasks: Task[];
  listManager: ListManager;

  constructor(
    private storage: StorageInterface,
    listManager: ListManager,
  ) {
    this.listManager = listManager;
    this.tasks = this.loadTasks();
  }

  loadTasks(): Task[] {
    const tasks = this.storage.get<Task[]>('tasks') ?? [];

    return tasks.map((task) => ({
      ...task,
      lists: task.lists ?? ['All tasks'],
    }));
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.find((task) => task._id === taskId);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  saveTask(
    title: string,
    description: string,
    scheduleDate: string,
    deadlineDate: string,
    priority: string,
    list: string,
    id?: string,
  ): Task {
    const today = format(new Date(), 'dd/MM/yyyy');
    const newTask = new Task(
      title,
      description,
      scheduleDate,
      deadlineDate,
      priority,
    );

    // List logic
    if (scheduleDate === today || !scheduleDate)
      newTask.lists.push(DEFAULT_LISTS.TODAY.title);

    if (list) newTask.lists.push(list);

    if (id) newTask._id = id;
    this.tasks.push(newTask);
    this.storage.save('tasks', this.tasks);

    return newTask;
  }

  deleteTask(taskId: string): Task | null {
    const index = this.tasks.findIndex((task) => task._id === taskId);
    if (index === -1) return null;

    const deletedTask = this.tasks.splice(index, 1)[0];
    this.storage.save('tasks', this.tasks);

    return deletedTask;
  }

  editTask(taskId: string, data: TaskFormValues): void {
    const today = format(new Date(), 'dd/MM/yyyy');

    const title = data['task-title'] ?? '';
    const description = data['task-description'] ?? '';
    const scheduleDate = data['task-schedule'] ?? '';
    const deadlineDate = data['task-deadline'] ?? '';
    const priority = data['priority'] ?? '';
    const newList = data['list'];

    const task = this.tasks.find((t) => t._id === taskId);
    if (!task) return;

    task.title = title;
    task.description = description;
    task.scheduleDate = scheduleDate;
    task.deadlineDate = deadlineDate;
    task.priority = priority;

    const hasToday = task.lists.includes(DEFAULT_LISTS.TODAY.title);

    if (scheduleDate === today && !hasToday) {
      task.lists.push(DEFAULT_LISTS.TODAY.title);
    } else if (scheduleDate && scheduleDate !== today && hasToday) {
      const index = task.lists.indexOf(DEFAULT_LISTS.TODAY.title);
      if (index !== -1) task.lists.splice(index, 1);
    }

    if (newList) {
      const allCustomLists = this.listManager.getLists();

      const customListIndex = task.lists.findIndex((list) =>
        allCustomLists.some((custom) => custom.title === list),
      );

      if (customListIndex !== -1) {
        task.lists[customListIndex] = newList;
      } else {
        task.lists.push(newList);
      }
    }

    this.storage.save('tasks', this.tasks);
  }

  toggleCompletion(taskId: string, state: boolean): void {
    const task = this.tasks.find((task) => task._id === taskId);
    if (!task) return;

    task.completed = state;

    const completedTitle = DEFAULT_LISTS.COMPLETED.title;
    const hasCompleted = task.lists.includes(completedTitle);

    if (state && !hasCompleted) {
      task.lists.push(completedTitle);
    } else if (!state && hasCompleted) {
      const index = task.lists.indexOf(completedTitle);
      if (index !== -1) task.lists.splice(index, 1);
    }

    this.storage.save('tasks', this.tasks);
  }

  checkOutdatedTasks(): void {
    const today = format(new Date(), 'dd/MM/yyyy');

    this.tasks.forEach((task) => {
      const hasToday = task.lists.includes(DEFAULT_LISTS.TODAY.title);

      if (!hasToday && task.scheduleDate && task.scheduleDate === today) {
        task.lists.push(DEFAULT_LISTS.TODAY.title);
      }
    });

    this.storage.save('tasks', this.tasks);
  }
}

export default TaskManager;
