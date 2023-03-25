export const numberToDay = (number: number) => {
  switch (number) {
    case 0:
      return "Monday";
    case 1:
      return "Tuesday";
    case 2:
      return "Wednesday";
    case 3:
      return "Thursday";
    case 4:
      return "Friday";
    case 5:
      return "Saturday";
    case 6:
      return "Sunday";
    default:
      return "Unknown";
  }
};

export const numberToServings = (number: number) => {
  if (number === 1) return "1 serving";
  return `${number} servings`;
};
