const getPreviousSundayDateString = (date = new Date()) => {
  const previousMonday = new Date();
  previousMonday.setDate(date.getDate() - date.getDay());
  previousMonday.setHours(0, 0, 0, 0);
  return previousMonday
    .toLocaleDateString("en-ZA", {
      timeZone: "Europe/Helsinki",
    })
    .replaceAll("/", "-");
};

module.exports = { getPreviousSundayDateString };
