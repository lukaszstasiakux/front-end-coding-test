export const add = (...arg) => {
  return arg.reduce((total, current) => {
    return total + current;
  });
};

export const listToObject = (list) => {
  const result = {};
  list.map((item) => {
    result[item.name] = JSON.parse(JSON.stringify(item.value));
  });
  return result;
};

export const objectToList = (obj) => {
  const result = [];
  Object.keys(obj).forEach((key) => {
    result.push({
      name: key,
      value: JSON.parse(JSON.stringify(obj[key])),
    });
  });
  return result;
};

const decodeName = (name) => {
  const decodedObj = {
    category: "",
    index: undefined,
    label: "",
    originalName: name,
  };
  const tmp = name.split("_");
  if (tmp[1]) {
    decodedObj.category = tmp[0].slice(0, -1);
    decodedObj.index = parseInt(tmp[0].charAt(tmp[0].length - 1));
    decodedObj.label = tmp[1];
  } else {
    decodedObj.category = tmp[0];
  }
  return decodedObj;
};

export const timeFormatCheck = (value) => {
  if (typeof value === "string") {
    const tmp = value.split(":");
    if (tmp[1]) {
      const date = new Date(parseInt(tmp[1]));
      let mm = date.getMonth() + 1;
      if (mm < 10) {
        mm = "0" + mm;
      }
      return `${date.getDate()}/${mm}/${date.getFullYear()}`;
    }
  }
  return value;
};

export const deserialize = (obj) => {
  const result = {};
  const structure = [];
  const categories = [];
  Object.keys(obj).forEach((key) => {
    const decodedObj = decodeName(key);
    structure.push(decodedObj);
    if (!categories.includes(decodedObj.category)) {
      categories.push(decodedObj.category);
    }
  });
  categories.map((category) => {
    const filetedData = structure.filter((item) => item.category === category);
    if (filetedData.length === 1) {
      result[category] = obj[filetedData[0].originalName];
    } else {
      result[category] = [];
      let checker = true;
      let i = 0;
      while (checker) {
        const categoryFilteredData = filetedData.filter(
          (item) => item.index === i
        );
        if (categoryFilteredData.length === 0) {
          checker = false;
        } else {
          const pushElement = {};
          categoryFilteredData.map((subItem) => {
            const value =
              typeof obj[subItem.originalName] !== "object"
                ? timeFormatCheck(obj[subItem.originalName])
                : deserialize(obj[subItem.originalName]);
            pushElement[subItem.label] = value;
          });
          result[category].push(pushElement);
          i++;
        }
      }
    }
  });
  return result;
};
