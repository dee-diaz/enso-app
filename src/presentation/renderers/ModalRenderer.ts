import logoSvg from '../../assets/img/logo-2.svg';
import iconSchedule from '../../assets/img/icon-schedule.svg';
import iconDeadline from '../../assets/img/icon-deadline.svg';
import iconPriority from '../../assets/img/icon-priority.svg';
import iconList from '../../assets/img/icon-list.svg';
import iconCheckCircle from '../../assets/img/icon-check-circle.svg';
import iconTrash from '../../assets/img/icon-trash.svg';

class ModalRenderer {
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.createTaskModal();
  }

  showOnboardingModal(): void {
    const modal = document.createElement('dialog');
    modal.id = 'modal-start';
    const img = document.createElement('img');
    img.className = 'logo';
    img.src = logoSvg;
    const h1 = document.createElement('h1');
    h1.textContent = 'Welcome to Enso';
    const para = document.createElement('p');
    para.textContent =
      'Your simple space for getting things done. Organize tasks, create lists, stay focused.';
    const button = document.createElement('button');
    button.className = 'btn btn-primary btn-continue';
    button.setAttribute('autofocus', '');
    button.textContent = 'Continue';
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    const paginationItem1 = document.createElement('div');
    paginationItem1.classList.add('active');
    const paginationItem2 = document.createElement('div');
    pagination.appendChild(paginationItem1);
    pagination.appendChild(paginationItem2);

    modal.appendChild(img);
    modal.appendChild(h1);
    modal.appendChild(para);
    modal.appendChild(button);
    modal.appendChild(pagination);
    this.container.appendChild(modal);
    modal.showModal();
  }

  renderOnboardingSecondStep(): void {
    const modal = document.querySelector('#modal-start');
    if (!(modal instanceof HTMLDialogElement)) return;
    modal.innerHTML = '';

    const img = document.createElement('img');
    img.className = 'logo';
    img.src = logoSvg;
    const h1 = document.createElement('h1');
    h1.textContent = 'What’s your name?';

    const form = document.createElement('form');
    form.setAttribute('id', 'form-name');

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'user-name');
    input.setAttribute('name', 'user-name');
    input.setAttribute('placeholder', 'Your first name');

    form.appendChild(input);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const buttonSkip = document.createElement('button');
    buttonSkip.className = 'btn btn-secondary btn-skip';
    buttonSkip.textContent = 'Skip';

    const buttonContinue = document.createElement('button');
    buttonContinue.setAttribute('type', 'submit');
    buttonContinue.setAttribute('form', 'form-name');
    buttonContinue.className = 'btn btn-primary btn-continue';
    buttonContinue.textContent = 'Continue';

    actionsDiv.appendChild(buttonSkip);
    actionsDiv.appendChild(buttonContinue);

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    const paginationItem1 = document.createElement('div');
    const paginationItem2 = document.createElement('div');
    paginationItem2.classList.add('active');
    pagination.appendChild(paginationItem1);
    pagination.appendChild(paginationItem2);

    modal.appendChild(img);
    modal.appendChild(h1);
    modal.appendChild(form);
    modal.appendChild(actionsDiv);
    modal.appendChild(pagination);
  }

  closeOnboardingModal(): void {
    const modal = document.querySelector('#modal-start');
    if (!(modal instanceof HTMLDialogElement)) return;
    modal.remove();
  }

  createTaskModal(): void {
    const body = document.querySelector('body');
    if (!body) return;
    const modal = document.createElement('dialog');
    modal.id = 'modal-task';

    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.id = 'btn-close-modal';
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'none');
    const path = document.createElementNS(svgns, 'path');
    path.setAttribute(
      'd',
      'M16.0673 15.1828C16.1254 15.2409 16.1714 15.3098 16.2028 15.3857C16.2343 15.4615 16.2505 15.5429 16.2505 15.625C16.2505 15.7071 16.2343 15.7884 16.2028 15.8643C16.1714 15.9402 16.1254 16.0091 16.0673 16.0672C16.0092 16.1252 15.9403 16.1713 15.8644 16.2027C15.7885 16.2342 15.7072 16.2503 15.6251 16.2503C15.543 16.2503 15.4617 16.2342 15.3858 16.2027C15.3099 16.1713 15.241 16.1252 15.1829 16.0672L10.0001 10.8836L4.81729 16.0672C4.70002 16.1844 4.54096 16.2503 4.3751 16.2503C4.20925 16.2503 4.05019 16.1844 3.93292 16.0672C3.81564 15.9499 3.74976 15.7908 3.74976 15.625C3.74976 15.4591 3.81564 15.3001 3.93292 15.1828L9.11651 9.99998L3.93292 4.81717C3.81564 4.69989 3.74976 4.54083 3.74976 4.37498C3.74976 4.20913 3.81564 4.05007 3.93292 3.93279C4.05019 3.81552 4.20925 3.74963 4.3751 3.74963C4.54096 3.74963 4.70002 3.81552 4.81729 3.93279L10.0001 9.11639L15.1829 3.93279C15.3002 3.81552 15.4593 3.74963 15.6251 3.74963C15.791 3.74963 15.95 3.81552 16.0673 3.93279C16.1846 4.05007 16.2505 4.20913 16.2505 4.37498C16.2505 4.54083 16.1846 4.69989 16.0673 4.81717L10.8837 9.99998L16.0673 15.1828Z',
    );
    path.setAttribute('fill', '#A5A5A5');
    svg.appendChild(path);
    modal.appendChild(svg);
    body.appendChild(modal);
    this.renderTaskForm();
  }

  renderTaskForm(): void {
    const modal = document.querySelector('#modal-task');
    if (!(modal instanceof HTMLDialogElement)) return;
    const form = document.createElement('form');
    form.className = 'form-task';
    form.id = 'form-task';

    const row1 = document.createElement('div');
    row1.className = 'row-1';
    const row2 = document.createElement('div');
    row2.className = 'row-2';
    const row3 = document.createElement('div');
    row3.className = 'row-3';
    const row4 = document.createElement('div');
    row4.className = 'row-4';

    const taskTitle = document.createElement('textarea');
    taskTitle.id = 'task-title';
    taskTitle.setAttribute('type', 'text');
    taskTitle.setAttribute('placeholder', 'New task');
    taskTitle.setAttribute('name', 'task-title');
    taskTitle.setAttribute('minlength', '1');
    taskTitle.setAttribute('maxlength', '100');
    taskTitle.setAttribute('form', 'form-task');

    const taskDescription = document.createElement('textarea');
    taskDescription.id = 'task-description';
    taskDescription.setAttribute('type', 'text');
    taskDescription.setAttribute('placeholder', 'Description');
    taskDescription.setAttribute('name', 'task-description');
    taskDescription.setAttribute('maxlength', '250');
    taskDescription.setAttribute('form', 'form-task');

    // Contents of the 3rd row
    const contents = ['task-schedule', 'task-deadline', 'priority'];
    contents.forEach((item) => {
      const container = document.createElement('div');
      container.className = item;
      const icon = document.createElement('img');
      const input = document.createElement('input');
      input.id = item;
      input.setAttribute('name', item);
      input.setAttribute('readonly', '');
      if (item === 'task-schedule') {
        icon.src = iconSchedule;
        input.setAttribute('placeholder', 'Schedule');
      } else if (item === 'task-deadline') {
        icon.src = iconDeadline;
        input.setAttribute('placeholder', 'Deadline');
      } else {
        icon.src = iconPriority;
        input.setAttribute('placeholder', 'No priority');
      }
      container.appendChild(icon);
      container.appendChild(input);
      row3.appendChild(container);
    });

    const listContainer = document.createElement('div');
    listContainer.className = 'task-list';
    const listIcon = document.createElement('img');
    listIcon.src = iconList;
    const listInput = document.createElement('input');
    listInput.id = 'list';
    listInput.setAttribute('name', 'list');
    listInput.setAttribute('readonly', '');
    listInput.setAttribute('placeholder', 'Select list');
    listContainer.appendChild(listIcon);
    listContainer.appendChild(listInput);

    const btnAdd = this.createSubmitButton();

    row1.appendChild(taskTitle);
    row2.appendChild(taskDescription);
    row4.appendChild(listContainer);
    row4.appendChild(btnAdd);

    form.appendChild(row1);
    form.appendChild(row2);
    form.appendChild(row3);
    form.appendChild(row4);
    modal.appendChild(form);
  }

  adaptFormForEditing(): void {
    const row4 = document.querySelector('.row-4');
    if (!(row4 instanceof HTMLElement)) return;
    const submitBtn = row4.querySelector('.btn-primary');
    if (!(submitBtn instanceof HTMLButtonElement)) return;
    submitBtn.remove();

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const completeBtn = document.createElement('button');
    completeBtn.setAttribute('type', 'button');
    completeBtn.id = 'btn-save-changes';
    const completeBtnIcon = document.createElement('img');
    completeBtnIcon.src = iconCheckCircle;
    const completeBtnText = document.createElement('span');
    completeBtnText.textContent = 'Save';
    completeBtn.appendChild(completeBtnIcon);
    completeBtn.appendChild(completeBtnText);

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.id = 'btn-delete';
    const deleteBtnIcon = document.createElement('img');
    deleteBtnIcon.src = iconTrash;
    deleteBtn.appendChild(deleteBtnIcon);

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);
    row4.appendChild(actionsDiv);
  }

  createSubmitButton(): HTMLButtonElement {
    const btnAdd = document.createElement('button');
    btnAdd.setAttribute('type', 'submit');
    btnAdd.setAttribute('form', 'form-task');
    btnAdd.textContent = 'Add';
    btnAdd.className = 'btn btn-primary';
    return btnAdd;
  }

  showTaskModal(type?: string): void {
    const modal = document.querySelector('#modal-task');
    if (!(modal instanceof HTMLDialogElement)) return;
    const listItems = modal.querySelectorAll('li.active');
    const submitBtn = modal.querySelector('button[type="submit"]');

    if (listItems) listItems.forEach((item) => item.classList.remove('active'));

    if (!submitBtn) {
      const row4 = document.querySelector('.row-4');
      const actions = document.querySelector('.actions');
      if (!actions || !row4) return;
      actions.remove();
      const btnAdd = this.createSubmitButton();
      row4.appendChild(btnAdd);
    }

    modal.showModal();

    if (type === 'edit') {
      this.adaptFormForEditing();
    }
  }

  closeTaskModal(): void {
    const modal = document.querySelector('#modal-task');
    if (!(modal instanceof HTMLDialogElement)) return;
    modal.close();
  }

  closeOnOutsideClick(e: MouseEvent): boolean | void {
    const modal = document.querySelector('#modal-task');
    if (!(modal instanceof HTMLDialogElement)) return;
    const dialogDimensions = modal.getBoundingClientRect();
    const visiblePickers = modal.querySelectorAll('.visible');
    const datePickers = document.querySelectorAll('.air-datepicker');

    const clickedOutside =
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom) &&
      visiblePickers.length === 0 &&
      datePickers.length === 0;

    if (clickedOutside) {
      this.closeTaskModal();
      return true; // flag “modal is closed”
    }

    return false; // return false if clicked inside the modal
  }
}

export default ModalRenderer;
