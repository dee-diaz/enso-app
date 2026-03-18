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
  activeListId: string;
  storage: LocalStorageAdapter;
  listManager: ListManager;
  taskManager: TaskManager;
  firstStart: boolean;
  userName: string | null;
  container: HTMLDivElement;
  sidebar: SidebarRenderer;
  modal: ModalRenderer;
  modalHandler: ModalHandler;
  taskRenderer: TaskRenderer;
  form: HTMLFormElement;
  formHandler: FormHandler;
  lastClickedTaskId?: string;

  constructor() {
    this.activeListId = DEFAULT_LISTS.TODAY.title;
    this.storage = new LocalStorageAdapter();
    this.listManager = new ListManager(this.storage);
    this.taskManager = new TaskManager(this.storage, this.listManager);
    this.firstStart = this.checkFirstStart();
    this.userName = null;
    this.container = document.querySelector('#content') as HTMLDivElement;
    this.sidebar = new SidebarRenderer(this.container);
    this.createInitialCustomLists();
    this.modal = new ModalRenderer(this.container);
    this.modalHandler = new ModalHandler(this.modal, (userName: string) => {
      this.handleOnboardingComplete(userName);
    });
    this.taskRenderer = new TaskRenderer(this.container);
    this.init();
    this.form = document.querySelector('#form-task') as HTMLFormElement;
    this.formHandler = new FormHandler(this.form);
    this.bindEvents();
    this.lastClickedTaskId = undefined;
  }

  checkFirstStart(): boolean {
    return this.storage.get('user-name') === null;
  }

  loadUserName(): void {
    this.userName = this.storage.get('user-name');
  }

  updateSidebarCounters() {
    const tasks = this.taskManager.getTasks();
    const mergedLists = [
      ...Object.values(DEFAULT_LISTS),
      ...this.listManager.getLists(),
    ];

    mergedLists.forEach((list: { title: string }) => {
      const count = FilterService.filterByList(tasks, list.title).length;
      this.sidebar.updateListCounter(list.title, count.toString());
    });
  }

  handleOnboardingComplete(userName: string): void {
    this.storage.save('user-name', userName);
    this.userName = userName;
    this.renderMainApp();
    initDatePickers();
    initDropdowns(this.listManager.getLists());
  }

  createInitialCustomLists(): void {
    const storage = this.listManager.getLists();
    if (!storage.length) {
      const lists = Object.values(customLists);
      lists.forEach((list) => {
        this.listManager.saveList(list.title, list.color);
      });
    }
  }

  renderCurrentList(): void {
    const tasks = this.taskManager.getTasks();
    const tasksFiltered = FilterService.filterByList(tasks, this.activeListId);
    const tasksSorted = SortingService.sortByPriority(tasksFiltered);
    this.taskRenderer.renderTaskList(tasksSorted);
  }

  renderMainApp(): void {
    const lists = this.listManager.getLists();
    this.sidebar.init(this.userName);
    this.sidebar.renderLists(lists, LIST_TYPE.CUSTOM);
    this.sidebar.setActiveList(this.activeListId);
    this.updateSidebarCounters();
    this.taskRenderer.init();
    this.taskRenderer.renderListTitle(this.activeListId);
    this.renderCurrentList();
  }

  init(): void {
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

  bindEvents(): void {
    const MOBILE_BREAKPOINT = 992;
    const priorityPicker = document.querySelector('.priority-picker');
    const listPicker = document.querySelector('.list-picker');

    document.addEventListener('click', (e: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const target = e.target as HTMLElement;
      if (
        target.closest('.btn-sidebar') &&
        window.innerWidth < MOBILE_BREAKPOINT
      ) {
        if (sidebar) sidebar.classList.add('visible');
      }

      if (target.closest('[data-list]')) {
        const list = target.closest('[data-list]') as HTMLElement | null;
        if (!list) return;
        const listId = list.dataset.list;
        if (!listId) return;

        const formattedListId =
          listId[0].toUpperCase() + listId.slice(1).replace('-', ' ');
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
          !target.closest('.sidebar') &&
          !target.closest('.btn-sidebar')
        ) {
          sidebar.classList.remove('visible');
        }
      }

      if (target.matches('#btn-add')) {
        this.lastClickedTaskId = undefined;
        this.form.reset();
        this.modal.showTaskModal();
      }

      if (target.closest('#btn-close-modal')) {
        this.lastClickedTaskId = undefined;
        this.modal.closeTaskModal();
      }

      if (target.closest('.btn-add-list')) {
        const container = document.querySelector('.custom-list');
        const button = target.closest('.btn-add-list');
        if (!button || !container) return;

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
              if (!ul || !addedList) return;

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

          // listForm.addEventListener('click', () => {
          //   this.formHandler.closeOnOutsideClick();
          // });
        }
      }

      if (target.matches('#modal-start .btn-continue')) {
        this.modalHandler.handleStartModalContinue(e);
      }
      if (target.matches('#modal-start .btn-skip')) {
        this.modalHandler.handleNameSkip();
      }
      if (target.matches('#priority') && priorityPicker) {
        priorityPicker.classList.toggle('visible');
      }
      if (target.matches('#list') && listPicker) {
        listPicker.classList.toggle('visible');
      }

      if (target.id !== 'priority' && priorityPicker) {
        priorityPicker.classList.remove('visible');
      }

      if (target.id !== 'list' && listPicker) {
        listPicker.classList.remove('visible');
      }

      // Edit task
      if (
        target.closest('[data-id]') &&
        !target.matches('input[type="checkbox"]')
      ) {
        const t = target.closest('[data-id]');
        if (!(t instanceof HTMLElement)) return;
        const taskId = t.dataset.id;
        if (!taskId) return;

        this.lastClickedTaskId = taskId;
        const task = this.taskManager.getTask(taskId);
        if (!task) return;
        const customLists = this.listManager.getLists();
        const customList = FilterService.defineCustomList(task, customLists);

        this.modal.showTaskModal('edit');

        const titleInput =
          document.querySelector<HTMLInputElement>('#task-title');
        const descriptionInput =
          document.querySelector<HTMLTextAreaElement>('#task-description');
        const scheduleInput =
          document.querySelector<HTMLInputElement>('#task-schedule');
        const deadlineInput =
          document.querySelector<HTMLInputElement>('#task-deadline');
        const priorityInput =
          document.querySelector<HTMLInputElement>('#priority');
        const listInput = document.querySelector<HTMLInputElement>('#list');

        if (
          !titleInput ||
          !descriptionInput ||
          !scheduleInput ||
          !deadlineInput ||
          !priorityInput ||
          !listInput
        )
          return;

        titleInput.value = task.title;
        if (task.description != null) descriptionInput.value = task.description;
        if (task.scheduleDate != null) scheduleInput.value = task.scheduleDate;
        if (task.deadlineDate != null) deadlineInput.value = task.deadlineDate;
        if (task.priority != null) priorityInput.value = task.priority;
        if (customList) listInput.value = customList;

        if (priorityInput.value) this.taskRenderer.highlightPriorityChoice();
        if (listInput.value) this.taskRenderer.highlightListChoice(customLists);
      }

      if (target.closest('#btn-delete') && this.lastClickedTaskId) {
        this.taskManager.deleteTask(this.lastClickedTaskId);
        this.modal.closeTaskModal();
        this.form.reset();
        this.renderCurrentList();
        this.updateSidebarCounters();
      }

      if (target.closest('#btn-save-changes')) {
        const values = this.formHandler.saveFormData(this.form);
        if (this.lastClickedTaskId)
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

    const modalTask = document.querySelector('#modal-task');
    if (!(modalTask instanceof HTMLElement)) return;
    
    modalTask.addEventListener('click', (e: MouseEvent) => {
      const closed = this.modal.closeOnOutsideClick(e);

      if (closed && this.lastClickedTaskId) {
        const values = this.formHandler.saveFormData(this.form);
        this.taskManager.editTask(this.lastClickedTaskId, values);
        this.updateSidebarCounters();
        this.renderCurrentList();
      }
    });

    document.addEventListener('change', (e: Event) => {
      if (!(e.target instanceof HTMLInputElement)) return;

      if (e.target.matches('input[type="checkbox"]')) {
        const li = e.target.closest('li');
        if (!(li instanceof HTMLElement)) return;
        const taskId = li.dataset.id;
        if (!taskId) return;
        const state = e.target.checked;
        this.taskManager.toggleCompletion(taskId, state);

        setTimeout(() => {
          this.updateSidebarCounters();
          this.renderCurrentList();
        }, 300);
      }
    });
  }

  handleSubmit(e: SubmitEvent): void {
    e.preventDefault();
    const values = this.formHandler.saveFormData(this.form);
    const validatedTitle = ValidationService.validateInput(
      values['task-title'],
    );

    if (validatedTitle) {
      this.taskManager.saveTask(
        values['task-title'] as string,
        values['task-description'] as string,
        values['task-schedule'] as string,
        values['task-deadline'] as string,
        values['priority'] as string,
        values['list'] as string,
      );
      this.lastClickedTaskId = undefined;
      this.form.reset();
      this.modal.closeTaskModal();
      this.renderCurrentList();
      this.updateSidebarCounters();
    }
  }
}

export default App;
