import { DEFAULT_LISTS, LIST_TYPE } from '../../utils/Constants';
import logoSvg from '../../assets/img/logo.svg';
import iconSidebar from '../../assets/img/icon-sidebar.svg';

type List =
  | { title: string; svgPath: string }
  | { title: string; markerColor: string };

// Pure sidebar display logic, no business rules
class SidebarRenderer {
  container: HTMLDivElement;
  sidebar!: HTMLElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  renderSidebarToggler(): void {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.className = 'btn-sidebar';
    const icon = document.createElement('img');
    icon.src = iconSidebar;

    button.appendChild(icon);
    this.container.appendChild(button);
  }

  renderGreeting(userName?: string | null): void {
    const greetingCont = document.querySelector<HTMLElement>('.greeting');
    if (!greetingCont) return;
    const h3 = document.createElement('h3');
    h3.textContent = userName ? `Hey, ${userName}` : 'Hey';
    const logo = document.createElement('img');
    logo.src = logoSvg;

    greetingCont.appendChild(logo);
    greetingCont.appendChild(h3);
  }

  renderLists(lists: Record<string, List> | List[], listType: string): void {
    const selector =
      listType === LIST_TYPE.DEFAULT ? '.default-list' : '.custom-list';

    const listTypeEl = document.querySelector<HTMLElement>(selector);
    if (!listTypeEl) return;

    listTypeEl.innerHTML = '';

    let ul: HTMLUListElement | null = null;

    if (listType === LIST_TYPE.CUSTOM) {
      const h3 = document.createElement('h3');
      h3.textContent = 'My lists';

      ul = document.createElement('ul');
      listTypeEl.append(h3, ul);
    }

    const container = ul ?? listTypeEl;

    const listsArr = Array.isArray(lists) ? lists : Object.values(lists);

    for (const list of Object.values(listsArr)) {
      const li = document.createElement('li');
      const button = document.createElement('button');

      const attrVal = list.title.toLowerCase().replace(/\s+/g, '-');
      button.dataset.list = attrVal;

      const div = document.createElement('div');

      const svgns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgns, 'svg');

      if (listType === LIST_TYPE.DEFAULT && 'svgPath' in list) {
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 20 20');

        const path = document.createElementNS(svgns, 'path');
        path.setAttribute('d', list.svgPath);
        svg.appendChild(path);
      } else if ('markerColor' in list) {
        svg.setAttribute('width', '12');
        svg.setAttribute('height', '12');
        svg.setAttribute('viewBox', '0 0 12 12');

        const circle = document.createElementNS(svgns, 'circle');
        circle.setAttribute('cx', '6');
        circle.setAttribute('cy', '6');
        circle.setAttribute('r', '5.5');
        circle.setAttribute('stroke', list.markerColor);
        svg.appendChild(circle);
      }

      const title = document.createElement('p');
      title.textContent = list.title;

      const counter = document.createElement('span');
      counter.textContent = '0';

      div.append(svg, title);
      button.append(div, counter);
      li.appendChild(button);

      container.appendChild(li);
    }

    if (listType === LIST_TYPE.CUSTOM) {
      const addBtn = this.createAddListBtn();
      listTypeEl.appendChild(addBtn);
    }
  }

  createSingleList(listTitle: string, markerColor: string): HTMLLIElement {
    const li = document.createElement('li');
    const button = document.createElement('button');
    const attrVal = listTitle.toLowerCase().replace(' ', '-');
    button.setAttribute('data-list', attrVal);
    const div = document.createElement('div');

    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');

    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('fill', 'none');
    const circle = document.createElementNS(svgns, 'circle');
    circle.setAttribute('cx', '6');
    circle.setAttribute('cy', '6');
    circle.setAttribute('r', '5.5');
    circle.setAttribute('stroke', markerColor);
    svg.appendChild(circle);

    const para = document.createElement('p');
    para.textContent = listTitle;

    const counter = document.createElement('span');
    counter.textContent = '0';

    div.appendChild(svg);
    div.appendChild(para);
    button.appendChild(div);
    button.appendChild(counter);
    li.appendChild(button);

    return li;
  }

  createAddListBtn(): HTMLButtonElement {
    const addBtn = document.createElement('button');
    addBtn.setAttribute('type', 'button');
    addBtn.className = 'btn-add-list';
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('fill', 'none');
    const path = document.createElementNS(svgns, 'path');
    path.setAttribute(
      'd',
      'M17.5 10C17.5 10.1658 17.4342 10.3247 17.3169 10.4419C17.1997 10.5592 17.0408 10.625 16.875 10.625H10.625V16.875C10.625 17.0408 10.5592 17.1997 10.4419 17.3169C10.3247 17.4342 10.1658 17.5 10 17.5C9.83424 17.5 9.67527 17.4342 9.55806 17.3169C9.44085 17.1997 9.375 17.0408 9.375 16.875V10.625H3.125C2.95924 10.625 2.80027 10.5592 2.68306 10.4419C2.56585 10.3247 2.5 10.1658 2.5 10C2.5 9.83424 2.56585 9.67527 2.68306 9.55806C2.80027 9.44085 2.95924 9.375 3.125 9.375H9.375V3.125C9.375 2.95924 9.44085 2.80027 9.55806 2.68306C9.67527 2.56585 9.83424 2.5 10 2.5C10.1658 2.5 10.3247 2.56585 10.4419 2.68306C10.5592 2.80027 10.625 2.95924 10.625 3.125V9.375H16.875C17.0408 9.375 17.1997 9.44085 17.3169 9.55806C17.4342 9.67527 17.5 9.83424 17.5 10Z',
    );
    path.setAttribute('fill', 'white');
    svg.appendChild(path);

    const btnText = document.createElement('span');
    btnText.textContent = 'Create new list';

    addBtn.appendChild(svg);
    addBtn.appendChild(btnText);

    return addBtn;
  }

  updateListCounter(listId: string, count: string): void {
    const attrName = listId.toLowerCase().replace(' ', '-');
    const counterEl = document.querySelector(`[data-list="${attrName}"] span`);
    if (counterEl) counterEl.textContent = count;
  }

  setActiveList(listId: string): void {
    const allLists = document.querySelectorAll('[data-list]');
    const attrName = listId.toLowerCase().replace(' ', '-');
    allLists.forEach((list) => list.classList.remove('active'));
    const list = document.querySelector<HTMLLIElement>(
      `[data-list="${attrName}"]`,
    );
    if (!list) return;
    list.classList.add('active');
  }

  createAddListInput(): HTMLFormElement {
    const form = document.createElement('form');
    form.id = 'form-custom-list';
    const div = document.createElement('div');

    const label = document.createElement('label');
    label.setAttribute('for', 'custom-list-input');
    label.textContent = 'List name';
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.id = 'custom-list-input';
    input.name = 'custom-list-input';

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.setAttribute('form', 'form-custom-list');
    submitBtn.innerText = 'Create';

    div.appendChild(label);
    div.appendChild(input);
    form.appendChild(div);
    form.appendChild(submitBtn);

    return form;
  }

  removeAddListInput(): void {
    const form = document.querySelector<HTMLFormElement>('#form-custom-list');
    if (!form) return;
    form.remove();
  }

  init(userName: string | null): void {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    const greeting = document.createElement('div');
    greeting.className = 'greeting';

    const defaultList = document.createElement('ul');
    defaultList.className = 'default-list';

    const customList = document.createElement('div');
    customList.className = 'custom-list';

    sidebar.appendChild(greeting);
    sidebar.appendChild(defaultList);
    sidebar.appendChild(customList);
    this.sidebar = sidebar;
    
    this.container.appendChild(sidebar);

    this.renderGreeting(userName);
    this.renderLists(DEFAULT_LISTS, LIST_TYPE.DEFAULT);
    this.renderSidebarToggler();
  }
}

export default SidebarRenderer;
