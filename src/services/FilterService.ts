// Translates UI filters → business queries
import { DEFAULT_LISTS } from '../utils/Constants';
import type Task from '../domain/Task';

type CustomList = {
  title: string;
  markerColor: string;
};

class FilterService {
  static filterByList(tasks: Task[], listName: string): Task[] {
    let filteredList;
    if (listName === DEFAULT_LISTS.COMPLETED.title) {
      filteredList = tasks.filter((task) => task.lists.includes(listName));
    } else {
      filteredList = tasks.filter(
        (task) =>
          task.lists.includes(listName) &&
          !task.lists.includes(DEFAULT_LISTS.COMPLETED.title),
      );
    }
    return filteredList;
  }

  static defineCustomList(
    task: Task,
    customListsArr: CustomList[] = [],
  ): string | null {
    const taskListArr = task.lists;

    const customListTitles = customListsArr.map((item) => item.title);

    const found = taskListArr.find((item) => customListTitles.includes(item));

    return found ?? null;
  }
}

export default FilterService;
