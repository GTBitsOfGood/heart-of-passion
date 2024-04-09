export const computeHeight = (
  startTime: string,
  endTime: string,
  screenHeight: number,
  zoom: number = 1.0,
): number => {
  var start = 0;
  var end = 0;
  startTime = startTime.toLowerCase();
  endTime = endTime.toLowerCase();

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
  return zoom * ((end - start) / 60) * (screenHeight / 24); //
};
