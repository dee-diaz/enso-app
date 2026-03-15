// Translates UI filters → business queries
import { DEFAULT_LISTS } from '../utils/Constants.ts';

class FilterService {
  static filterByList(tasks, listName) {
    let filteredList;
    if (listName === DEFAULT_LISTS.COMPLETED.title) {
      filteredList = tasks.filter((task) => task._lists.includes(listName));
    } else {
      filteredList = tasks.filter(
        (task) =>
          task._lists.includes(listName) &&
          !task._lists.includes(DEFAULT_LISTS.COMPLETED.title),
      );
    }
    return filteredList;
  }

  static defineCustomList(task, customListsArr = []) {
    if (!Array.isArray(customListsArr)) return null;
    const taskListArr = task._lists || [];
    const customListTitles = customListsArr.map((item) => item.title);
    const customList = taskListArr.filter((item) =>
      customListTitles.includes(item),
    );
    return customList[0] || null;
  }
}

export default FilterService;
