// Reusable calendar UI component
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import 'air-datepicker/air-datepicker.css';

function initDatePickers() {
  const baseOptions = {
    locale: localeEn,
    container: document.querySelector('#modal-task') as HTMLElement,
    classes: 'custom-calendar-theme',
    dateFormat: 'dd/MM/yyyy',
    autoClose: true,
  };

  new AirDatepicker('#task-schedule', {
    ...baseOptions,
    position: 'bottom left' as const,
  });

  new AirDatepicker('#task-deadline', {
    ...baseOptions,
    position: 'bottom right' as const,
  });
}

export default initDatePickers;
