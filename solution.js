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
      const day = date.getDate();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
  return value;
};

export const setValue = (value) => {
  return typeof value !== "object"
    ? timeFormatCheck(value)
    : deserialize(value);
};

export const generateStructureObject = (filteredData, obj) => {
  const result = {};
  filteredData.map((item) => {
    const value = setValue(obj[item.originalName]);
    result[item.label] = value;
  });
  return result;
};

export const setStructure = (obj) => {
  const structure = [];
  const categories = [];
  Object.keys(obj).forEach((key) => {
    const decodedObj = decodeName(key);
    structure.push(decodedObj);
    if (!categories.includes(decodedObj.category)) {
      categories.push(decodedObj.category);
    }
  });
  return { categories, structure };
};

export const getMaxIndex = (array) => {
  return Math.max.apply(
    Math,
    array.map((item) => {
      return item.index;
    })
  );
};

export const deserialize = (obj) => {
  const result = {};
  const data = setStructure(obj);
  data.categories.map((category) => {
    const filetedData = data.structure.filter(
      (item) => item.category === category
    );
    if (filetedData.length === 1) {
      result[category] = obj[filetedData[0].originalName];
    } else {
      result[category] = [];
      const maxIndex = getMaxIndex(filetedData);

      for (let i = 0; i <= maxIndex; i++) {
        const categoryFilteredData = filetedData.filter(
          (item) => item.index === i
        );
        const pushElement = generateStructureObject(categoryFilteredData, obj);
        result[category].push(pushElement);
      }
    }
  });
  return result;
};
