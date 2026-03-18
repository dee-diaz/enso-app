import { PRIORITY } from '../../utils/Constants';
import ValidationService from '../../services/ValidationService.js';
import { TaskFormValues } from '../../types/formValues';

// Form interaction management
class FormHandler {
  form: HTMLFormElement;

  constructor(formReference: HTMLFormElement) {
    this.form = formReference;
  }

  handlePrioritySelect(e: Event) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const priorityInput = document.querySelector('#priority');
    if (!(priorityInput instanceof HTMLInputElement)) return;

    const listItems = document.querySelectorAll('.priority-picker li');
    listItems.forEach((item) => item.classList.remove('active'));

    const selectedListItem = target.closest('li');
    if (!selectedListItem) return;

    selectedListItem.classList.add('active');

    if (selectedListItem.id === 'low-priority')
      priorityInput.value = PRIORITY.LOW;
    if (selectedListItem.id === 'medium-priority')
      priorityInput.value = PRIORITY.MEDIUM;
    if (selectedListItem.id === 'high-priority')
      priorityInput.value = PRIORITY.HIGH;
  }

  handleListSelect(e: Event) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.matches('h5')) return;

    const listInput = document.querySelector('#list');
    if (!(listInput instanceof HTMLInputElement)) return;

    listInput.value = target.textContent;
  }

  handleListAdd(e: SubmitEvent) {
    e.preventDefault();
    const target = e.target;
    if (!(target instanceof HTMLFormElement)) return;

    const formData = this.saveFormData(target);
    const listTitle = Object.values(formData).join('');
    const isValidated = ValidationService.validateInput(listTitle);

    if (isValidated) return listTitle;
  }

  saveFormData(form: HTMLFormElement): TaskFormValues {
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    return {
      'task-title': values['task-title'] as string,
      'task-description': values['task-description'] as string,
      'task-schedule': values['task-schedule'] as string,
      'task-deadline': values['task-deadline'] as string,
      priority: values['priority'] as string,
      list: values['list'] as string,
    };
  }
}

export default FormHandler;
