export const dateFormat = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${day}${month}/${year}`;
};


// export const dateFormat = (date, format = "yyyy-MM-dd HH:mm") => {
//   if (!date) return "-"; // Handle null/undefined/empty

//   const d = date instanceof Date ? date : new Date(date);
//   if (isNaN(d.getTime())) return "-"; // Handle invalid date

//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   const hours = String(d.getHours()).padStart(2, "0");
//   const minutes = String(d.getMinutes()).padStart(2, "0");
//   const seconds = String(d.getSeconds()).padStart(2, "0");

//   switch (format) {
//     case "yyyy-MM-dd":
//       return `${year}-${month}-${day}`;
//     case "yyyy-MM-dd HH:mm":
//       return `${year}-${month}-${day} ${hours}:${minutes}`;
//     case "yyyy-MM-dd HH:mm:ss":
//       return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     case "MM/dd/yyyy":
//       return `${month}/${day}/${year}`;
//     case "dd-MM-yyyy":
//       return `${day}-${month}-${year}`;
//     default:
//       return `${day}-${month}-${year} ${hours}:${minutes}`;
//   }
// };