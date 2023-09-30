export const computeTime = (startTime: string, endTime: string): number => {
  var start = 0;
  var end = 0;
  startTime = startTime.toLowerCase()
  endTime = endTime.toLowerCase()

  if (startTime.endsWith("am")) {
    var [startHours, startMins] = (startTime.split(" am")[0] || "").split(":");
    if (startHours !== "12") {
      start += parseInt(startHours || "0") * 60;
    }
    start += parseInt(startMins || "0");
  } else {
    var [startHours, startMins] = (startTime.split(" pm")[0] || "").split(":");
    if (startHours !== "12") {
      start += (parseInt(startHours || "0") + 12) * 60;
    } else {
      start += 720;
    }
    start += parseInt(startMins || "0");
  }

  if (endTime.endsWith("am")) {
    var [endHours, endMins] = (endTime.split(" am")[0] || "").split(":");
    if (endHours !== "12") {
      end += parseInt(endHours || "0") * 60;
    }
    end += parseInt(endMins || "0");
  } else {
    var [endHours, endMins] = (endTime.split(" pm")[0] || "").split(":");
    if (endHours !== "12") {
      end += (parseInt(endHours || "0") + 12) * 60;
    } else {
      end += 720;
    }
    end += parseInt(endMins || "0");
  }
  return Math.round(((end - start) / 1440) * 150); // * 100 -> * 150 to make slightly bigger
};
