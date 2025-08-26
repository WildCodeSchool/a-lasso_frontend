import { MessageService } from 'primeng/api';

export function showSuccessToast(toast: MessageService, detail?: string): void {
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: detail || 'Opération effectuée avec succès.',
  });
}

export function showWarnToast(toast: MessageService, detail?: string): void {
  toast.add({
    severity: 'warn',
    summary: 'Attention',
    detail: detail || 'Veuillez vérifier cette opération.',
  });
}

export function showInfoToast(toast: MessageService, detail?: string): void {
  toast.add({
    severity: 'info',
    summary: 'Information',
    detail: detail || 'Opération réalisée.',
  });
}

export function showErrorToast(toast: MessageService, detail?: string): void {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: detail || 'Une erreur est survenue. Veuillez réessayer.',
  });
}
