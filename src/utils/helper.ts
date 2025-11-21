export const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "scheduled":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  export const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      ?.substring(0, 2);
  };

  export const processISOString = (date: string) => {
    const year = date?.substring(0, 4);
    const month = date?.substring(5, 7);
    const day = date?.substring(8, 10);
    const time = date?.substring(11, 16);

    let monthName = "";
    switch (month) {
      case "01":
        monthName = "January";
        break;
      case "02":
        monthName = "February";
        break;
      case "03":
        monthName = "March";
        break;
      case "04":
        monthName = "April";
        break;
      case "05":
        monthName = "May";
        break;
      case "06":
        monthName = "June";
        break;
      case "07":
        monthName = "July";
        break;
      case "08":
        monthName = "August";
        break;
      case "09":
        monthName = "September";
        break;
      case "10":
        monthName = "October";
        break;
      case "11":
        monthName = "November";
        break;
      case "12":
        monthName = "December";
        break;
    }

    const dateFormat = day + " " + monthName + ", " + year + "  " + time;

    return dateFormat;
  };
