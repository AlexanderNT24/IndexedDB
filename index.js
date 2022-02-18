let db;
const list = document.querySelector("td");
document.getElementById("buttonView").style.display = "none";

document.getElementById("buttonInsert").onclick = () => {
  const name = document.getElementById("name").value;
  const dni = document.getElementById("dni").value;
  const birthDate = document.getElementById("birthDate").value;
  data = { dni: dni, name: name, birthDate: birthDate };
  addData(data);
};

document.getElementById("buttonSearchUser").onclick = () => {
  const dni = document.getElementById("searchDniUser").value;
  document.getElementById("buttonView").style.display = "block";
  getDataUser(dni);
};

document.getElementById("buttonView").onclick = () => {
  consult();
  document.getElementById("buttonView").style.display = "none";
};

function addElement(nameData, dniData, brithDateData) {
  const listItem = document.createElement("li");
  const name = document.createElement("h3");
  const dni = document.createElement("h3");
  const birthDate = document.createElement("h3");

  listItem.appendChild(name);
  listItem.appendChild(dni);
  listItem.appendChild(birthDate);
  list.appendChild(listItem);

  // Coloca los datos del cursor dentro de h3 y para
  name.textContent = "Nombre: " + nameData;
  name.style = "font-style: italic;";
  dni.textContent = "DNI: " + dniData;
  dni.style = "font-style: italic;";
  birthDate.textContent = "Fecha Nacimiento: " + brithDateData;
  birthDate.style = "font-style: italic;";

  // Crea un botón y lo coloca dentro de cada listItem
  const deleteBtn = document.createElement("button");
  deleteBtn.onclick = () => {
    console.log("elimino");
    const trasaccion = db.transaction(["users"], "readwrite");
    const coleccionObjetos = trasaccion.objectStore("users");
    console.log(dniData);
    const conexion = coleccionObjetos.delete(dniData);

    conexion.onsuccess = () => {
      consult();
    };
  };
  deleteBtn.textContent = "Eliminar";
  deleteBtn.className = "button small";
  listItem.appendChild(deleteBtn);

  const updateButton = document.createElement("button");
  updateButton.textContent = "Actualizar";
  updateButton.className = "button small";
  updateButton.onclick = () => {
    const updateName = document.createElement("input");
    updateName.type = "text";
    updateName.placeholder = "Ingresa tu nombre";
    updateName.id = "updateName";
    listItem.appendChild(updateName);

    const updateBirthDate = document.createElement("input");
    updateBirthDate.type = "date";
    updateBirthDate.id = "updateBirthDate";
    listItem.appendChild(updateBirthDate);

    const updateButtonSend = document.createElement("button");
    updateButtonSend.className = "button small";
    updateButtonSend.type = "submit";
    updateButtonSend.id = "updateButtonSend";
    updateButtonSend.textContent = "Guardar";
    listItem.appendChild(updateButtonSend);

    document.getElementById("updateButtonSend").onclick = () => {
      const name = document.getElementById("updateName").value;
      const dni = dniData;
      const birthDate = document.getElementById("updateBirthDate").value;
      data = { dni: dni, name: name, birthDate: birthDate };

      const trasaccion = db.transaction(["users"], "readwrite");
      const coleccionObjetos = trasaccion.objectStore("users");
      const conexion = coleccionObjetos.put(data);
      consult();
    };
  };
  listItem.appendChild(updateButton);
}

const connection = window.indexedDB.open("users", 1);

connection.onsuccess = () => {
  db = connection.result;
  consult();
  console.log("Base de datos abierta", db);
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

const addData = (info) => {
  const trasaccion = db.transaction(["users"], "readwrite");
  const coleccionObjetos = trasaccion.objectStore("users");
  const conexion = coleccionObjetos.add(data);
  consult();
};

const getDataUser = (dni) => {
  deleteAllElements();
  const trasaccion = db.transaction(["users"], "readonly");
  const coleccionObjetos = trasaccion.objectStore("users");
  const conexion = coleccionObjetos.get(dni);

  conexion.onsuccess = (e) => {
    addElement(
      conexion.result.name,
      conexion.result.dni,
      conexion.result.birthDate
    );

    console.log(conexion.result);
  };
  conexion.onerror = (e) => {
    addElement("No found user with dni");
  };
};

const consult = () => {
  deleteAllElements();
  const trasaccion = db.transaction(["users"], "readonly");
  const coleccionObjetos = trasaccion.objectStore("users");
  const conexion = coleccionObjetos.openCursor();

  var boolCursor = false;
  conexion.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(cursor.value);
      boolCursor = true;
      addElement(cursor.value.name, cursor.value.dni, cursor.value.birthDate);
      cursor.continue();
    }
    if (boolCursor) {
      document.getElementById("noElementsSpan").style.display = "none";
    } else {
      document.getElementById("noElementsSpan").style.display = "block";
    }
  };
};

const deleteAllElements = () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};
