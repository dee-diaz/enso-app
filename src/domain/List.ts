import { createDate } from './Task';
import { LIST_COLORS } from '../utils/Constants';

class List {
  _id: number | string;
  title: string;
  markerColor: string;
  _creationDate: string;

  constructor(title: string, color?: string) {
    this._id = Math.random()
      .toString(36)
      .substring(2, 6 + 2);
    this.title = title;
    this.markerColor = color || LIST_COLORS[this.generateRandomColorKey()];
    this._creationDate = createDate();
  }

  generateRandomColorKey(): keyof typeof LIST_COLORS {
    const keys = Object.keys(LIST_COLORS) as (keyof typeof LIST_COLORS)[];
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }
}

export default List;
