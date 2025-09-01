export type APIResponseToggleRegister = {
  isRegistered: boolean;
  activityParticipantsRequestDTO: {
    current: number;
    max: number;
  };
};
