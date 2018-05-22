var addBtn = document.getElementById('add');
var inputTask = document.getElementById('new-task');
var unfinishedList = document.getElementById('unfinished-tasks');
var finishedList = document.getElementById('finished-tasks');

// Функция добавления нового элемента в список
function createNewElement(task, finished) {
    var listItem = document.createElement('li');

    var checkbox = document.createElement('button');
    checkbox.className = "material-icons checkbox";

    var label = document.createElement('label');
    label.innerText = task;

    var input = document.createElement('input');
    input.type = "text";

    var btnEdit = document.createElement('button');
    btnEdit.className = "material-icons edit";
    btnEdit.innerHTML = "<i class='material-icons'>edit</i>";

    var btnDel = document.createElement('button');
    btnDel.className = "material-icons delete";
    btnDel.innerHTML = "<i class='material-icons'>delete</i>";

    if (finished) {
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
        btnEdit.style.display = "none";
    } else {
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(btnDel);
    listItem.appendChild(btnEdit);

    return listItem
}

function addTask() {
    if (inputTask.value) {
        var listItem = createNewElement(inputTask.value, false);
        unfinishedList.appendChild(listItem);
        bindTaskEvent(listItem, finishTask);
        inputTask.value = "";
    }
    saveTask();
}
addBtn.onclick = addTask;

function deleteTask() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    saveTask();
}

function editTask() {
    var editBtn = this;
    var listItem = this.parentNode;
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input[type="text"]');
    var checkbox = listItem.querySelector('button.checkbox');

    var containsClass = listItem.classList.contains('editMode');

    if (containsClass) {
        label.innerText = input.value;
        editBtn.className = "material-icons edit";
        editBtn.innerHTML = "<i class='material-icons'>edit</i>";

        checkbox.disabled = false;

        saveTask();
    } else {
        input.value = label.innerText;
        editBtn.className = "material-icons save";
        editBtn.innerHTML = "<i class='material-icons'>save</i>";

        checkbox.disabled = true;
    }

    listItem.classList.toggle('editMode');
}

function finishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>"

    var btnEdit = listItem.querySelector("button.edit");
    btnEdit.style.display = "none";

    finishedList.appendChild(listItem);
    bindTaskEvent(listItem, unfinishTask);

    saveTask();
}

function unfinishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>"

    var btnEdit = listItem.querySelector("button.edit");
    btnEdit.style.display = "block";

    unfinishedList.appendChild(listItem);
    bindTaskEvent(listItem, finishTask);

    saveTask();
}

//События списка
function bindTaskEvent(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector("button.checkbox");
    var editBtn = listItem.querySelector('button.edit');
    var deleteBtn = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editBtn.onclick = editTask;
    deleteBtn.onclick = deleteTask;
}

// Сохранение в localStorage
function saveTask() {
    var unfinishedTasksArr = [];
    for (var i = 0; i < unfinishedList.children.length; i++) {
        unfinishedTasksArr.push(unfinishedList.children[i].getElementsByTagName('label')[0].innerText);
    };
    console.log(unfinishedTasksArr);

    var finishedTasksArr = [];
    for (var i = 0; i < finishedList.children.length; i++) {
        finishedTasksArr.push(finishedList.children[i].getElementsByTagName('label')[0].innerText);
    };

    localStorage.setItem('simple_task_list', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        funishedTasks: finishedTasksArr
    }));
}

//Получение данных из localStorage
function load() {
    return JSON.parse(localStorage.getItem('simple_task_list'));
}

// Загрузка элементов при запуске приложения
var data = load();
for (var i = 0; i < data.unfinishedTasks.length; i++) {
    var listItem = createNewElement(data.unfinishedTasks[i], false);
    unfinishedList.appendChild(listItem);
    bindTaskEvent(listItem, finishTask);
}

for (var i = 0; i < data.funishedTasks.length; i++) {
    var listItem = createNewElement(data.funishedTasks[i], true);
    finishedList.appendChild(listItem);
    bindTaskEvent(listItem, unfinishTask);
}

// Очистка всего списка
var unfinishedAllDel = document.getElementById('unfinished-list-del');
unfinishedAllDel.onclick = function () {
    while (unfinishedList.firstChild) {
        unfinishedList.removeChild(unfinishedList.firstChild);
    }
    saveTask();
}

var finishedAllDel = document.getElementById('finished-list-del');
finishedAllDel.onclick = function () {
    while (finishedList.firstChild) {
        finishedList.removeChild(finishedList.firstChild);
    }
    saveTask();
}

