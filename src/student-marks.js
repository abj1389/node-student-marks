const fs = require("fs");
const prompt = require("prompt-sync")();

const calcAverage = (marks) => {
  let sum = 0;
  marks.forEach((mark) => {
    sum = sum + mark;
  });
  return sum / marks.length;
};

const generateCsv = (jsonData) => {
  let marksOfSameAlumn = [];
  const newJsonData = [];
  for (let i = 0; i < jsonData.length; i++) {
    for (let j = 0; j < jsonData.length; j++) {
      if (jsonData[i].name === jsonData[j].name) {
        marksOfSameAlumn.push(jsonData[j].mark);
      }
    }
    newJsonData.push({ name: jsonData[i].name, mark: calcAverage(marksOfSameAlumn), test: jsonData[i].test });
    marksOfSameAlumn = [];
  }
  return newJsonData;
};

const convertJsonToCsv = (jsonData) => {
  let csv = "";
  // Encabezados
  const firstItemInJson = jsonData[0];
  const headers = Object.keys(firstItemInJson);
  const headersUppered = [];
  headers.forEach((header) => {
    headersUppered.push(header.charAt(0).toUpperCase() + header.slice(1));
  });
  csv = csv + headersUppered.join(";") + "; \n";

  // Datos
  const newJsonData = generateCsv(jsonData);
  newJsonData.forEach((item) => {
    // Dentro de cada fila recorremos todas las propiedades
    headers.forEach((header) => {
      csv = csv + item[header] + ";";
    });
    csv = csv + "\n";
  });
  return csv;
};

const filePath = "student-marks.json"; // prompt("Introduce la ruta de un fichero JSON: ");

fs.readFile(filePath, (readError, data) => {
  if (readError) {
    console.log("Ha ocurrido un error leyendo el fichero");
  } else {
    try {
      const parsedData = JSON.parse(data);
      const csv = convertJsonToCsv(parsedData);

      const filePathOutput = prompt("Introduce la ruta del fichero a generar: ");
      fs.writeFile(filePathOutput, csv, (error) => {
        if (error) {
          console.log("Ha ocurrido un error escribiendo el fichero");
        } else {
          console.log("Fichero guardado correctamente!");
        }
      });
    } catch (parseError) {
      console.log("Ha ocurrido un error PARSEANDO el fichero", parseError);
    }
  }
});
