type DateLimits = {
  minDate: Date | undefined;
  maxDate: Date | undefined;
};

export function updateDateLimits(dateMode: string): DateLimits {
  const today = new Date();
  let minDate: Date | undefined;
  let maxDate: Date | undefined;

  if (dateMode === 'future') {
    minDate = today;
    maxDate = undefined;
  } else if (dateMode === 'past') {
    maxDate = today;
    minDate = undefined;
  } else {
    minDate = undefined;
    maxDate = undefined;
  }
  return { minDate, maxDate };
}
