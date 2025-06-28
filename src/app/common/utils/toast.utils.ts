import { MessageService } from 'primeng/api';

export function showSuccessToast(toast: MessageService): void {
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: 'Opération effectuée avec succès.',
  });
}

export function showWarnToast(toast: MessageService): void {
  toast.add({
    severity: 'warn',
    summary: 'Attention',
    detail: 'Veuillez vérifier cette opération.',
  });
}

export function showInfoToast(toast: MessageService): void {
  toast.add({
    severity: 'info',
    summary: 'Information',
    detail: 'Opération réalisée.',
  });
}
