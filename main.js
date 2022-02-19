// Init elemets
let peoples = []

function initPage() {
    refreshForm()
}

function refreshForm() {
    document.getElementById('name').value = null
    document.getElementById('dni').value = null
    document.getElementById('birthDate').value = '2021-02-12'
}

function refreshInputSearch() {
    document.getElementById('searchDniUser').value = null
}

function getValueDOMById(idObject) {
    return document.getElementById(idObject).value
}

// function transfer data

function insertPeople() {
    const newPerson = {
        name: getValueDOMById('name'),
        dni: getValueDOMById('dni'),
        birthDate: getValueDOMById('birthDate')
    }
    peoples.push(newPerson)

    refreshForm()
    insertAllDataTable(peoples)
}

function searchData() {
    const inputSearch = getValueDOMById('searchDniUser')

    const filterValues = peoples.filter(element => {
        if (element.dni.includes(inputSearch)) {
            return true;
        }
    })
    insertAllDataTable(filterValues)
}


// DOM update
function insertAllDataTable(arrayValues) {

    let text = ''

    for (let i = 0; i < arrayValues.length; i++) {
        const element = arrayValues[i]
        text += '<tr>'
        text += `<td>${element.name}</td>`
        text += `<td>${element.dni}</td>`
        text += `<td>${element.birthDate}</td>`
        text += '</tr>'
    }
    insertHTMLToObject('data', text)
}

function insertHTMLToObject(idObject, HTML) {
    document.getElementById(idObject).innerHTML = HTML;
}





// Runs
initPage()