export type ButtonClicked = {
  id: number;
  label: string;
  event: MouseEvent;
};

export enum ButtonStyleClass {
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
  addActivityButton = 'add-activity-button',
  defaultWhite = 'default-white',
  defaultWhiteSelected = 'default-white selected',
  defaultBlue = 'default-blue',
  defaultBlueSelected = 'default-blue selected',
}
