// Reusable priority selector UI component
import { PRIORITY } from '../../utils/Constants';
import List from '../../domain/List';

type DropdownType = 'priority' | 'list';

function createDropdown(
  inputId: DropdownType,
  customListArr: List[],
): HTMLDivElement {
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = `${inputId}-picker`;
  const title = document.createElement('h5');
  title.textContent = inputId[0].toUpperCase() + inputId.slice(1);
  const list = document.createElement('ul');

  if (inputId === 'priority') {
    for (let i = 0; i < Object.values(PRIORITY).length; i++) {
      const li = document.createElement('li');
      li.id = Object.values(PRIORITY)[i].toLowerCase() + '-priority';
      const exclamation = document.createElement('span');
      exclamation.className = 'exclamation';
      const text = document.createElement('span');
      text.className = 'text';
      text.textContent = Object.values(PRIORITY)[i];
      exclamation.textContent = '!'.repeat(i + 1);

      switch (Object.values(PRIORITY)[i]) {
        case 'Low':
          exclamation.classList.add('low');
          break;
        case 'Medium':
          exclamation.classList.add('medium');
          break;
        case 'High':
          exclamation.classList.add('high');
          break;
      }

      li.appendChild(exclamation);
      li.appendChild(text);
      list.appendChild(li);
    }

    dropdownContainer.appendChild(title);
    dropdownContainer.appendChild(list);
  }

  if (inputId === 'list') {
    for (let i = 0; i < customListArr.length; i++) {
      const li = document.createElement('li');
      li.id = 'list-' + customListArr[i].title.toLowerCase();

      const svgns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgns, 'svg');
      svg.setAttribute('width', '16px');
      svg.setAttribute('height', '16px');
      svg.setAttribute('viewBox', '0 0 16 16');
      svg.setAttribute('fill', 'none');

      const circle = document.createElementNS(svgns, 'circle');
      circle.setAttribute('cx', '8');
      circle.setAttribute('cy', '8');
      circle.setAttribute('r', '4.3');
      circle.setAttribute('stroke', customListArr[i].markerColor);

      svg.appendChild(circle);

      const text = document.createElement('span');
      text.className = 'text';
      text.textContent = customListArr[i].title;

      li.appendChild(svg);
      li.appendChild(text);
      list.appendChild(li);
    }

    dropdownContainer.appendChild(title);
    dropdownContainer.appendChild(list);
  }

  return dropdownContainer;
}

function initDropdowns(customListArr: List[]): void {
  const containerPriority = document.querySelector('.row-3');
  const containerList = document.querySelector('.row-4');

  if (!containerPriority || !containerList) return;

  const priorityPicker = createDropdown('priority', customListArr);
  const listPicker = createDropdown('list', customListArr);

  containerPriority.appendChild(priorityPicker);
  containerList.appendChild(listPicker);
}

export default initDropdowns;
