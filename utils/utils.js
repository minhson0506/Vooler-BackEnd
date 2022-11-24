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

const dateIsValid = (dateInput) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const dateStr = dateInput.substring(0, 10);

  if (dateStr.substring(0, 10).match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);
  // console.log(date);

  const timestamp = date.getTime();
  // console.log(timestamp);

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }
  // console.log("dateISOstr", date.toISOString());

  return date.toISOString().startsWith(dateStr);
};

module.exports = { getPreviousSundayDateString, dateIsValid };
