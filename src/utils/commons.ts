export const isValidIP = (ip: string): boolean => {
  const ipRegExp =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegExp.test(ip);
};

export const getDateFormatted = (): string => {
  const currentDate: Date = new Date();
  const year: string = currentDate.getFullYear().toString();
  const month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day: string = currentDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}