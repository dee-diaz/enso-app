// Modal interaction management
import type ModalRenderer from '../renderers/ModalRenderer';

class ModalHandler {
  modalRenderer: ModalRenderer;
  onComplete: (userName: string) => void;
  onboardingStep: number;

  constructor(
    modalRenderer: ModalRenderer,
    onComplete: (userName: string) => void,
  ) {
    this.modalRenderer = modalRenderer;
    this.onComplete = onComplete;
    this.onboardingStep = 1;
  }

  handleStartModalContinue(e: MouseEvent): void {
    if (this.onboardingStep === 1) {
      this.modalRenderer.renderOnboardingSecondStep();
      this.onboardingStep = 2;
    } else if (this.onboardingStep === 2) {
      e.preventDefault();
      this.onboardingStep = 1;

      const input = document.querySelector('#modal-start input');
      if (!(input instanceof HTMLInputElement)) return;
      const inputVal = input.value || 'buddy';
      this.modalRenderer.closeOnboardingModal();
      this.onComplete(inputVal);
    }
  }

  handleNameSkip(): void {
    const defaultName = 'buddy';
    this.modalRenderer.closeOnboardingModal();
    this.onComplete(defaultName);
  }
}

export default ModalHandler;
