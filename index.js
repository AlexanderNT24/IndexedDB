let db

document.getElementById("buttonInsert").onclick = () => {
  const name=document.getElementById("name").value;
  const dni=document.getElementById("dni").value;
  const birthDate=document.getElementById("birthDate").value;
  data={dni:dni, name:name, birthDate:birthDate}
  agregar(data)
};

document.getElementById("buttonShow").onclick = () => {
  consult()
};

document.getElementById("buttonDeleteUser").onclick = () => {
  const dni=document.getElementById("deleteDniUser").value;
  deleteData(dni)
};
document.getElementById("buttonSearchUser").onclick = () => {
  const dni=document.getElementById("searchDniUser").value;
  get(dni)
};

function addElement (text) {
  var newDiv = document.createElement("div");
  var newContent = document.createTextNode(text);
  newDiv.appendChild(newContent); 
  var currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}

const connection = window.indexedDB.open('users',1);

connection.onsuccess = () =>{
  db = connection.result
  console.log('Base de datos abierta', db)
}

connection.onerror = (error) =>{
  console.log('Error ', error)
}

connection.onupgradeneeded = (e) =>{
  db = e.target.result
  console.log('Base de datos creada', db)
  const coleccionObjetos = db.createObjectStore('users',{
      keyPath: 'dni'
    })
}


const agregar = (info) => {
  const trasaccion = db.transaction(['users'],'readwrite')
  const coleccionObjetos = trasaccion.objectStore('users')
  const conexion = coleccionObjetos.add(data)
  consult()
}

const get = (dni) =>{
  const trasaccion = db.transaction(['users'],'readonly')
  const coleccionObjetos = trasaccion.objectStore('users')
  const conexion = coleccionObjetos.get(dni)

  conexion.onsuccess = (e) =>{
    addElement("Name: "+conexion.result.name)
    addElement("DNI: "+conexion.result.dni)
    addElement("Birth Date: "+conexion.result.birthDate)
    
      console.log(conexion.result)
  }
  conexion.onerror = (e) =>{
    addElement("No found user with dni")
    
  }
  
}

const deleteData = (dni) =>{      
  const trasaccion = db.transaction(['users'],'readwrite')
  const coleccionObjetos = trasaccion.objectStore('users')
  const conexion = coleccionObjetos.delete(dni)

  conexion.onsuccess = () =>{
      consult()
  }
}

const consult = () =>{
  const trasaccion = db.transaction(['users'],'readonly')
  const coleccionObjetos = trasaccion.objectStore('users')
  const conexion = coleccionObjetos.openCursor()


  conexion.onsuccess = (e) =>{
      const cursor = e.target.result
      if(cursor){
          console.log(cursor.value)
          addElement("Name: "+cursor.value.name)
          addElement("DNI: "+cursor.value.dni)
          addElement("Birth Date: "+cursor.value.birthDate)
          addElement("---------------------")
          cursor.continue()
      }else{
        addElement("No hay usuarios")
      }
  }
}
