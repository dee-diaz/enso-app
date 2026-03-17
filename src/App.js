import TaskManager from './domain/TaskManager';
import FilterService from './services/FilterService';
import LocalStorageAdapter from './infrastructure/LocalStorageAdapter';
import SidebarRenderer from './presentation/renderers/SidebarRenderer';
import ModalRenderer from './presentation/renderers/ModalRenderer';
import ModalHandler from './presentation/handlers/ModalHandler';
import FormHandler from './presentation/handlers/FormHandler';
import { DEFAULT_LISTS, customLists, LIST_TYPE } from './utils/Constants';
import TaskRenderer from './presentation/renderers/TaskRenderer';
import initDatePickers from './presentation/components/Calendar';
import initDropdowns from './presentation/components/dropdowns';
import ValidationService from './services/ValidationService';
import SortingService from './services/SortingService';
import ListManager from './domain/ListManager';

// Orchestrates all layers, manages application state
class App {
  constructor() {
    this.activeListId = DEFAULT_LISTS.TODAY.title;
    this.storage = new LocalStorageAdapter();
    this.listManager = new ListManager(this.storage);
    this.taskManager = new TaskManager(this.storage, this.listManager);
    this.firstStart = this.checkFirstStart();
    this.userName = undefined;
    this.container = document.querySelector('#content');
    this.sidebar = new SidebarRenderer(this.container, '.sidebar');
    this.createInitialCustomLists();
    this.modal = new ModalRenderer(this.container);
    this.modalHandler = new ModalHandler(this.modal, (userName) => {
      this.handleOnboardingComplete(userName);
    });
    this.taskRenderer = new TaskRenderer(this.container);
    this.init();
    this.form = document.querySelector('#form-task');
    this.formHandler = new FormHandler(this.form);
    this.bindEvents();
    this.lastClickedTaskId = undefined;
  }

  checkFirstStart() {
    return this.storage.get('user-name') === null;
  }

  loadUserName() {
    this.userName = this.storage.get('user-name');
  }

  updateSidebarCounters() {
    const tasks = this.taskManager.getTasks();
    const customLists = this.listManager.getLists();
    const mergedLists = Object.values(DEFAULT_LISTS).concat(customLists);

    mergedLists.forEach((list) => {
      const count = FilterService.filterByList(tasks, list.title).length;
      this.sidebar.updateListCounter(list.title, count);
    });
  }

  handleOnboardingComplete(userName) {
    this.storage.save('user-name', userName);
    this.userName = userName;
    this.renderMainApp();
    initDatePickers();
    initDropdowns(this.listManager.getLists());
  }

  createInitialCustomLists() {
    const storage = this.listManager.getLists();
    if (!storage.length) {
      const lists = Object.values(customLists);
      lists.forEach((list) => {
        this.listManager.saveList(list.title, list.color);
      });
    }
  }

  renderCurrentList() {
    const tasks = this.taskManager.getTasks();
    const tasksFiltered = FilterService.filterByList(tasks, this.activeListId);
    const tasksSorted = SortingService.sortByPriority(tasksFiltered);
    this.taskRenderer.renderTaskList(tasksSorted);
  }

  renderMainApp() {
    const lists = this.listManager.getLists();
    this.sidebar.init(this.userName);
    this.sidebar.renderLists(lists, LIST_TYPE.CUSTOM);
    this.sidebar.setActiveList(this.activeListId);
    this.updateSidebarCounters();
    this.taskRenderer.init();
    this.taskRenderer.renderListTitle(this.activeListId);
    this.renderCurrentList();
  }

  init() {
    if (this.firstStart === true) {
      this.modal.showOnboardingModal();
    } else {
      this.loadUserName();
      this.renderMainApp();
      this.taskManager.checkOutdatedTasks();
      initDatePickers();
      initDropdowns(this.listManager.getLists());
    }
  }

  bindEvents() {
    const MOBILE_BREAKPOINT = 992;
    const priorityPicker = document.querySelector('.priority-picker');
    const listPicker = document.querySelector('.list-picker');

    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      if (
        e.target.closest('.btn-sidebar') &&
        window.innerWidth < MOBILE_BREAKPOINT
      ) {
        if (sidebar) sidebar.classList.add('visible');
      }

      if (e.target.closest('[data-list]')) {
        const target = e.target.closest('[data-list]');
        const formattedListId =
          target.dataset.list[0].toUpperCase() +
          target.dataset.list.slice(1).replace('-', ' ');
        this.activeListId = formattedListId;
        this.sidebar.setActiveList(this.activeListId);
        this.taskRenderer.cleanListTitle();
        this.taskRenderer.renderListTitle(this.activeListId);
        this.renderCurrentList();

        if (window.innerWidth < MOBILE_BREAKPOINT) {
          const sidebar = document.querySelector('.sidebar');
          if (sidebar) sidebar.classList.remove('visible');
        }

        return;
      }

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        if (
          sidebar &&
          sidebar.classList.contains('visible') &&
          !e.target.closest('.sidebar') &&
          !e.target.closest('.btn-sidebar')
        ) {
          sidebar.classList.remove('visible');
        }
      }

      if (e.target.matches('#btn-add')) {
        this.lastClickedTaskId = null;
        this.form.reset();
        this.modal.showTaskModal();
      }

      if (e.target.closest('#btn-close-modal')) {
        this.lastClickedTaskId = null;
        this.modal.closeTaskModal();
      }

      if (e.target.closest('.btn-add-list')) {
        const container = document.querySelector('.custom-list');
        const button = e.target.closest('.btn-add-list');
        button.classList.add('hidden');

        const listForm = this.sidebar.createAddListInput();
        container.appendChild(listForm);

        if (listForm) {
          listForm.addEventListener('submit', (e) => {
            const listTitle = this.formHandler.handleListAdd(e);

            if (listTitle) {
              const ul = container.querySelector('ul');
              this.listManager.saveList(listTitle);
              const addedList = this.listManager.getLists().at(-1);
              this.sidebar.removeAddListInput();
              const listItem = this.sidebar.createSingleList(
                addedList.title,
                addedList.markerColor,
              );
              ul.appendChild(listItem);
              const addBtn = this.sidebar.createAddListBtn();
              container.appendChild(addBtn);
            }
          });

          listForm.addEventListener('click', () => {
            // this.formHandler.closeOnOutsideClick();
          });
        }
      }

      if (e.target.matches('#modal-start .btn-continue')) {
        this.modalHandler.handleStartModalContinue(e);
      }
      if (e.target.matches('#modal-start .btn-skip')) {
        this.modalHandler.handleNameSkip();
      }
      if (e.target.matches('#priority') && priorityPicker) {
        priorityPicker.classList.toggle('visible');
      }
      if (e.target.matches('#list') && listPicker) {
        listPicker.classList.toggle('visible');
      }

      if (e.target.id !== 'priority' && priorityPicker) {
        priorityPicker.classList.remove('visible');
      }

      if (e.target.id !== 'list' && listPicker) {
        listPicker.classList.remove('visible');
      }

      // Edit task
      if (
        e.target.closest('[data-id]') &&
        !e.target.matches('input[type="checkbox"]')
      ) {
        const target = e.target.closest('[data-id]');
        const taskId = target.dataset.id;
        this.lastClickedTaskId = taskId;
        const task = this.taskManager.getTask(taskId);
        const customLists = this.listManager.getLists();
        const customList = FilterService.defineCustomList(task, customLists);

        this.modal.showTaskModal('edit');

        const titleInput = document.querySelector('#task-title');
        const descriptionInput = document.querySelector('#task-description');
        const scheduleInput = document.querySelector('#task-schedule');
        const deadlineInput = document.querySelector('#task-deadline');
        const priorityInput = document.querySelector('#priority');
        const listInput = document.querySelector('#list');

        titleInput.value = task.title;
        descriptionInput.value = task.description;
        scheduleInput.value = task.scheduleDate;
        deadlineInput.value = task.deadlineDate;
        priorityInput.value = task.priority;
        listInput.value = customList;

        if (priorityInput.value) this.taskRenderer.highlightPriorityChoice();
        if (listInput.value) this.taskRenderer.highlightListChoice(customLists);
      }

      if (e.target.closest('#btn-delete')) {
        this.taskManager.deleteTask(this.lastClickedTaskId);
        this.modal.closeTaskModal();
        this.form.reset();
        this.renderCurrentList();
        this.updateSidebarCounters();
      }

      if (e.target.closest('#btn-save-changes')) {
        const values = this.formHandler.saveFormData(this.form);
        this.taskManager.editTask(this.lastClickedTaskId, values);
        this.modal.closeTaskModal();
        this.updateSidebarCounters();
        this.renderCurrentList();
      }
    });

    if (priorityPicker)
      priorityPicker.addEventListener(
        'click',
        this.formHandler.handlePrioritySelect,
      );

    if (listPicker)
      listPicker.addEventListener('click', this.formHandler.handleListSelect);

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    document.querySelector('#modal-task').addEventListener('click', (e) => {
      const closed = this.modal.closeOnOutsideClick(e);

      if (closed && this.lastClickedTaskId) {
        const values = this.formHandler.saveFormData(this.form);
        this.taskManager.editTask(this.lastClickedTaskId, values);
        this.updateSidebarCounters();
        this.renderCurrentList();
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        const taskId = e.target.closest('li').dataset.id;
        const state = e.target.checked;
        this.taskManager.toggleCompletion(taskId, state);

        setTimeout(() => {
          this.updateSidebarCounters();
          this.renderCurrentList();
        }, 300);
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const values = this.formHandler.saveFormData(this.form);
    const validatedTitle = ValidationService.validateInput(
      values['task-title'],
    );

    if (validatedTitle) {
      this.taskManager.saveTask(
        values['task-title'],
        values['task-description'],
        values['task-schedule'],
        values['task-deadline'],
        values['priority'],
        values['list'],
      );
      this.lastClickedTaskId = null;
      this.form.reset();
      this.modal.closeTaskModal();
      this.renderCurrentList();
      this.updateSidebarCounters();
    }
  }
}

export default App;
