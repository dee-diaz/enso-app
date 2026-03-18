// Task/List validation rules
class ValidationService {
  static validateInput(input: string): boolean {
    const minLength = 1;
    if (input.trim().length < minLength) {
      console.warn('Title should be at least 1 character');
      const titleInput =
        document.querySelector<HTMLInputElement>('#task-title');
      titleInput!.focus();
      return false;
    } else {
      return true;
    }
  }
}

export default ValidationService;
