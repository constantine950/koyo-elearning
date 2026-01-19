export const formatDate = (dateString: string | number | Date): string => {
  try {
    // Handle different date formats
    let date: Date;

    if (typeof dateString === "string") {
      // Check if it's a numeric string (timestamp)
      if (/^\d+$/.test(dateString)) {
        date = new Date(parseInt(dateString, 10));
      } else {
        date = new Date(dateString);
      }
    } else if (typeof dateString === "number") {
      date = new Date(dateString);
    } else {
      date = dateString;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

export const formatDateTime = (dateString: string | number | Date): string => {
  try {
    let date: Date;

    if (typeof dateString === "string") {
      if (/^\d+$/.test(dateString)) {
        date = new Date(parseInt(dateString, 10));
      } else {
        date = new Date(dateString);
      }
    } else if (typeof dateString === "number") {
      date = new Date(dateString);
    } else {
      date = dateString;
    }

    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "N/A";
  }
};

export const formatRelativeTime = (
  dateString: string | number | Date
): string => {
  try {
    let date: Date;

    if (typeof dateString === "string") {
      if (/^\d+$/.test(dateString)) {
        date = new Date(parseInt(dateString, 10));
      } else {
        date = new Date(dateString);
      }
    } else if (typeof dateString === "number") {
      date = new Date(dateString);
    } else {
      date = dateString;
    }

    if (isNaN(date.getTime())) {
      return "N/A";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "N/A";
  }
};
