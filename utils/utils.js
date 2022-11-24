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

const dateIsValid = (dateStr) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);
  console.log(date);

  const timestamp = date.getTime();
  console.log(timestamp);

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    // 👇️ this runs
    return false;
  }

  return date.toISOString().startsWith(dateStr);
};

module.exports = { getPreviousSundayDateString, dateIsValid };
