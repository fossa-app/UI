export const formatDateToLocaleString = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const daysUntil = (dateString?: string): number => {
  if (!dateString) {
    return 0;
  }

  const targetDate = new Date(dateString);
  const today = new Date();

  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const msInDay = 1000 * 60 * 60 * 24;
  const diffInMs = targetDate.getTime() - today.getTime();

  return Math.max(0, Math.ceil(diffInMs / msInDay));
};
