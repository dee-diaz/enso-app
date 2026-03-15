// CRUD operations, data management
import Task from './Task';
import { DEFAULT_LISTS } from '../utils/Constants.ts';
import { format } from 'date-fns';

class TaskManager {
  constructor(storageAdapter, listManager) {
    this.storage = storageAdapter;
    this.listManager = listManager;
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    const tasks = this.storage.get('tasks');
    return tasks !== null ? tasks : [];
  }

  getTask(taskId) {
    const tasks = this.storage.get('tasks');
    const task = tasks.filter((task) => task._id === taskId)[0];
    console.log(task);
    return task;
  }

  getTasks() {
    return this.tasks;
  }

  saveTask(title, description, scheduleDate, deadlineDate, priority, list, id) {
    const today = format(new Date(), 'dd/MM/yyyy');
    const newTask = new Task(title);
    description
      ? (newTask.description = description)
      : (newTask.description = '');
    scheduleDate
      ? (newTask.scheduleDate = scheduleDate)
      : (newTask.scheduleDate = '');
    deadlineDate
      ? (newTask.deadlineDate = deadlineDate)
      : (newTask.deadlineDate = '');
    priority ? (newTask.priority = priority) : (newTask.priority = '');

    // List logic
    if (scheduleDate === today || !scheduleDate)
      newTask._lists.push(DEFAULT_LISTS.TODAY.title);
    if (list) newTask._lists.push(list);
    if (id) newTask._id = id;
    this.tasks.push(newTask);
    this.storage.save('tasks', this.tasks);

    // Debug logs
    console.log('Task saved', newTask);
    console.table(this.storage.get('tasks'));

    return newTask;
  }

  deleteTask(taskId) {
    const deletedTask = this.tasks.find((task) => task._id === taskId);
    if (!deletedTask) {
      console.warn('Task to delete not found by ID');
      return;
    }
    const index = this.tasks.findIndex((task) => task._id === taskId);
    if (index !== -1) this.tasks.splice(index, 1);
    this.storage.save('tasks', this.tasks);

    // Debug log
    console.log(`Task '${deletedTask.title}' has been deleted`);

    return deletedTask;
  }

  editTask(taskId, formData) {
    const today = format(new Date(), 'dd/MM/yyyy');
    const tasks = this.storage.get('tasks');
    const index = tasks.findIndex((task) => task._id === taskId);
    const task = tasks[index];

    if (index !== -1) {
      task.title = formData['task-title'];
      task.description = formData['task-description'];
      task.scheduleDate = formData['task-schedule'];
      task.deadlineDate = formData['task-deadline'];
      task.priority = formData['priority'];

      const hasTodayInListArr = task._lists.includes(DEFAULT_LISTS.TODAY.title);

      if (task.scheduleDate === today && !hasTodayInListArr) {
        task._lists.push(DEFAULT_LISTS.TODAY.title);
      } else if (
        task.scheduleDate &&
        task.scheduleDate !== today &&
        hasTodayInListArr
      ) {
        const todayIndex = task._lists.indexOf(DEFAULT_LISTS.TODAY.title);
        if (todayIndex !== -1) task._lists.splice(todayIndex, 1);
      }

      if (formData['list']) {
        const newList = formData['list'];
        const allCustomLists = this.listManager.getLists();

        const customListIndex = task._lists.findIndex((list) => {
          return allCustomLists.some((customList) => customList.title === list);
        });
        if (customListIndex !== -1) {
          task._lists[customListIndex] = newList;
        } else {
          task._lists.push(newList);
        }
      }

      this.tasks = tasks;
      this.storage.save('tasks', this.tasks);
    }
  }

  toggleCompletion(taskId, state) {
    const tasks = this.storage.get('tasks');
    const index = tasks.findIndex((task) => task._id === taskId);
    const task = tasks[index];
    task.completed = state;

    if (
      task.completed &&
      !task._lists.includes(DEFAULT_LISTS.COMPLETED.title)
    ) {
      task._lists.push(DEFAULT_LISTS.COMPLETED.title);
    } else {
      const index = task._lists.findIndex(
        (list) => list === DEFAULT_LISTS.COMPLETED.title,
      );
      task._lists.splice(index, 1);
    }

    this.tasks = tasks;
    this.storage.save('tasks', this.tasks);
  }

  checkOutdatedTasks() {
    const today = format(new Date(), 'dd/MM/yyyy');

    this.tasks.forEach((task) => {
      const hasTodayInListArr = task._lists.includes(DEFAULT_LISTS.TODAY.title);

      if (
        !hasTodayInListArr &&
        task.scheduleDate &&
        task.scheduleDate === today
      ) {
        task._lists.push(DEFAULT_LISTS.TODAY.title);
      }
    });

    this.storage.save('tasks', this.tasks);
  }
}

export default TaskManager;
