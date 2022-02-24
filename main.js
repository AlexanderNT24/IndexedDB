// Init elemets
let peoples = [];
let db;

function initPage() {  
  initDataBase();
  refreshForm();

}

function refreshForm() {
  document.getElementById("name").value = null;
  document.getElementById("dni").value = null;
  document.getElementById("birthDate").value = "2021-02-12";
}

function refreshInputSearch() {
  document.getElementById("searchDniUser").value = null;
}

function getValueDOMById(idObject) {
  return document.getElementById(idObject).value;
}

// function transfer data

function insertPeopleFromDb(cursor) {
  peoples.push(
    (newPerson = {
      name: cursor.value.name,
      dni: cursor.value.dni,
      birthDate: cursor.value.birthDate,
    })
  );
  refreshForm();
  insertAllDataTable(peoples);
}

function insertPeople() {
  const newPerson = {
    name: getValueDOMById("name"),
    dni: getValueDOMById("dni"),
    birthDate: getValueDOMById("birthDate"),
  };
  peoples.push(newPerson);
  insertData(newPerson);
  refreshForm();
  insertAllDataTable(peoples);
}

function searchData() {
  const inputSearch = getValueDOMById("searchDniUser");

  const filterValues = peoples.filter((element) => {
    if (element.dni.includes(inputSearch)) {
      return true;
    }
  });
  insertAllDataTable(filterValues);
}

//CRUD DataBase
function initDataBase() {
  const connection = window.indexedDB.open("users", 1);

  connection.onsuccess = () => {
    db = connection.result;
    console.log("Base de datos abierta", db);
    readData();
  };

  connection.onerror = (error) => {
    console.log("Error ", error);
  };

  connection.onupgradeneeded = (e) => {
    db = e.target.result;
    console.log("Base de datos creada", db);
    const coleccionObjetos = db.createObjectStore("users", {
      keyPath: "dni",
    });
  };
}

function readData() {
  const trasaccion = db.transaction(["users"], "readwrite");
  const coleccionObjetos = trasaccion.objectStore("users");
  const conexion = coleccionObjetos.openCursor();

  let boolCursor = false;
  conexion.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(cursor.value);
      insertPeopleFromDb(cursor);
      cursor.continue();
    }
  };
}

function insertData(data) {
  const trasaccion = db.transaction(["users"], "readwrite");
  const coleccionObjetos = trasaccion.objectStore("users");
  const conexion = coleccionObjetos.add(data);
}

function deleteData(id, dniData) {
  const trasaccion = db.transaction(["users"], "readwrite");
  const coleccionObjetos = trasaccion.objectStore("users");
  console.log("dni:"+dniData);
  const conexion = coleccionObjetos.delete(dniData);

  conexion.onsuccess = () => {
    peoples.splice(id, 1);
    console.log(peoples)
    insertAllDataTable(peoples);
  };
}

// DOM update
function insertAllDataTable(arrayValues) {
  let text = "";

  for (let i = 0; i < arrayValues.length; i++) {
    const element = arrayValues[i];
    text += "<tr>";
    text += `<td>${element.name}</td>`;
    text += `<td>${element.dni}</td>`;
    text += `<td>${element.birthDate}</td>`;
    text += `<td><button onclick="deleteData(${i},${element.dni})">Eliminar</button></td>`;
    text += "</tr>";
  }
  insertHTMLToObject("data", text);
}

function insertHTMLToObject(idObject, HTML) {
  document.getElementById(idObject).innerHTML = HTML;
}

// Runs
window.onload = initPage();
