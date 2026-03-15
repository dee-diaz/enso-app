import { DEFAULT_LISTS, PRIORITY } from '../../utils/Constants.ts';
import { format, parse, isBefore, startOfToday } from 'date-fns';
import FilterService from '../../services/FilterService';

class TaskRenderer {
  constructor(container) {
    this.container = container;
  }

  renderListTitle(listId) {
    const main = document.querySelector('.main');
    const h1 = document.querySelector('#list-title');
    h1.textContent = listId;

    if (listId === DEFAULT_LISTS.TODAY.title) {
      const today = format(new Date(), 'EEEE, MMMM d');
      const para = document.createElement('p');
      para.id = 'todays-date';
      para.textContent = today;
      const secondChild = main.children[1];
      main.insertBefore(para, secondChild);
    }
  }

  renderTask(id, title, deadlineDate, priority, list, isChecked) {
    const li = document.createElement('li');
    li.setAttribute('data-id', id);
    li.className = 'task-list-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    const label = document.createElement('label');
    label.textContent = title;
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    inputWrapper.appendChild(checkbox);
    inputWrapper.appendChild(label);

    const rowTop = document.createElement('div');
    rowTop.className = 'row-top';
    const span = document.createElement('span');
    span.className = `priority ${priority.toLowerCase()}`;
    switch (priority) {
      case PRIORITY.LOW:
        span.textContent = '!';
        checkbox.classList.add(PRIORITY.LOW.toLowerCase());
        break;
      case PRIORITY.MEDIUM:
        span.textContent = '!!';
        checkbox.classList.add(PRIORITY.MEDIUM.toLowerCase());
        break;
      case PRIORITY.HIGH:
        span.textContent = '!!!';
        checkbox.classList.add(PRIORITY.HIGH.toLowerCase());
        break;
    }

    const rowBottom = document.createElement('div');
    rowBottom.className = 'row-bottom';
    const due = document.createElement('span');
    due.className = 'due';

    if (deadlineDate) {
      due.textContent = `Due ${deadlineDate}`;
      const taskDate = parse(deadlineDate, 'dd/MM/yyyy', new Date());
      const today = startOfToday();
      if (isBefore(taskDate, today)) {
        due.textContent = `Past due ${deadlineDate}`;
        due.classList.add('past-due');
      }
    }

    const customListName = document.createElement('span');
    customListName.className = 'custom-list';
    customListName.textContent = list;

    rowBottom.appendChild(due);
    rowBottom.appendChild(customListName);

    rowTop.appendChild(inputWrapper);
    rowTop.appendChild(span);

    li.appendChild(rowTop);
    li.appendChild(rowBottom);

    return li;
  }

  renderTaskList(tasks) {
    const taskList = document.querySelector('.task-list');
    const customLists = JSON.parse(localStorage.getItem('lists')) || [];
    this.cleanTaskList(taskList);
    tasks.forEach((task) => {
      const customList = FilterService.defineCustomList(task, customLists);
      const li = this.renderTask(
        task._id,
        task.title,
        task.deadlineDate,
        task.priority,
        customList,
        task.completed,
      );
      taskList.appendChild(li);
    });
  }

  cleanTaskList(listEl) {
    listEl.innerHTML = '';
  }

  cleanListTitle() {
    const titleEl = document.querySelector('#list-title');
    const dateEl = document.querySelector('#todays-date');
    titleEl.textContent = '';
    if (dateEl) dateEl.textContent = '';
  }

  highlightPriorityChoice() {
    const priorityInput = document.querySelector('#priority');
    const priorityPicker = document.querySelector('.priority-picker');
    const listItems = priorityPicker.querySelectorAll('li');
    listItems.forEach((item) => item.classList.remove('active'));

    Object.values(PRIORITY).forEach((item) => {
      if (priorityInput.value === item) {
        const priorityVal = item.toLowerCase();
        const li = priorityPicker.querySelector(`#${priorityVal}-priority`);
        li.classList.add('active');
      }
    });
  }

  highlightListChoice(customListArr) {
    const listInput = document.querySelector('#list');
    const listPicker = document.querySelector('.list-picker');
    const listItems = listPicker.querySelectorAll('li');
    listItems.forEach((item) => item.classList.remove('active'));

    customListArr.forEach((listObj) => {
      if (
        listObj.title &&
        listInput.value.toLowerCase() === listObj.title.toLowerCase()
      ) {
        const li = listPicker.querySelector(
          `#list-${listObj.title.toLowerCase()}`,
        );
        if (li) li.classList.add('active');
      }
    });
  }

  init() {
    const main = document.createElement('div');
    main.className = 'main';

    const h1 = document.createElement('h1');
    h1.id = 'list-title';

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-add';
    addBtn.id = 'btn-add';
    addBtn.textContent = 'Add new task';

    const ul = document.createElement('ul');
    ul.className = 'task-list';

    main.appendChild(h1);
    main.appendChild(addBtn);
    main.appendChild(ul);
    this.container.appendChild(main);
  }
}

export default TaskRenderer;
