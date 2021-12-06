const form = document.querySelector('#new-project-input');
const newProjectButton = document.querySelector('#new-project-button');
const newProjectName = document.querySelector('#new-project-name');
const projectList = document.querySelector('#project-list');
const openProjectContainer = document.querySelector('#open-project-container');
const retrievedData = localStorage.getItem("storedProjects");
let projects = '';


//create projects array on first page load or if local storage cleared
function initializeProjects(){
    if (localStorage['storedProjects']){
        projects = JSON.parse(retrievedData);
        return projects;
    } else {
        console.log('no');
        projects = [];
        return projects;
    };
};
initializeProjects();

//constructors
class ToDo {
    constructor(task, dueDate, priority, completed){
        this.task = task
        this.dueDate = dueDate
        this.priority = priority
        this.completed = completed
    }
};

class Project {
    constructor(name, []) {
        this.name = name
        this.tasks = []
      }
};

//default project
function addDefaultProject(){   
    if (projects.length === 0){
        defaultProject = new Project('default', []);
        projects.push(defaultProject)
        localStorage.setItem("storedProjects", JSON.stringify(projects));
        generateProjectList(projectList, projects);
    } else {
        generateProjectList(projectList, projects);
    };
};
addDefaultProject();

//add new projects
newProjectButton.addEventListener('click', createProject, false);

function createProject() {
    event.preventDefault();
    newProject = new Project(newProjectName.value, []);
    projects.push(newProject)
    localStorage.setItem("storedProjects", JSON.stringify(projects));
    generateProjectList(projectList, projects)
};

//populate list of projects
function generateProjectList(projectList, projects) {
    projectList.textContent = '';
    form.reset();
    for (let element of projects) {
        const newLi = document.createElement('li');
            newLi.setAttribute('id', element.name);

        const liSpan = document.createElement('span');
            liSpan.textContent = element.name;
            liSpan.addEventListener('click', displayProject, false);

        newLi.appendChild(liSpan);

        const deleteProjectButton = document.createElement('button');
            deleteProjectButton.textContent ='Delete';
            deleteProjectButton.addEventListener('click', deleteProject, false);

        newLi.appendChild(deleteProjectButton);
        projectList.appendChild(newLi);
    }
};

//delete project
function deleteProject(){
    const projectToDelete = this.parentNode.id;
    const indexOfProjectToDelete = projects.findIndex(x => x.name === projectToDelete);
    projects.splice(indexOfProjectToDelete, 1);
    localStorage.setItem("storedProjects", JSON.stringify(projects));
    generateProjectList(projectList, projects); 
    openProjectContainer.textContent='';
};

//open project to show to-dos
function displayProject(e){
    openProjectContainer.textContent = '';

    const openProject = document.createElement('div');
        openProject.setAttribute('id', e.target.parentNode.id+'-open');

    const selectedProjectTitle = document.createElement('h2');
        selectedProjectTitle.textContent = e.target.parentNode.id;

    const taskList = document.createElement('ol');
        taskList.setAttribute('id', 'task-list');

    //create new todo input
    const addToDoForm = document.createElement('form');
        addToDoForm.setAttribute('id', 'add-to-do-input');

    const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'New to-do');
        input.setAttribute('id', 'new-to-do-name');
        addToDoForm.appendChild(input);

    //create priority input
    //create array of priority options
    const priority = ["Low priority","Moderate priority","High priority","Immediate priority"];

    //Create and append select list
    const newToDoPriority = document.createElement("select");
    newToDoPriority.setAttribute('id', 'new-to-do-priority');
    addToDoForm.appendChild(newToDoPriority);

    //Create and append the options
    for (var i = 0; i < priority.length; i++) {
        const option = document.createElement("option");
        option.value = priority[i];
        option.text = priority[i];
        newToDoPriority.appendChild(option);
    } 

    //Create due date input and label
    const dueDate = document.createElement('input');
        dueDate.setAttribute('type', 'date');
        dueDate.setAttribute('id', 'new-to-do-due-date');
    
    const dueDateLabel = document.createElement("Label");
        dueDateLabel.setAttribute("for", dueDate);
        dueDateLabel.textContent = "Due date:";
        
    addToDoForm.appendChild(dueDateLabel);
    addToDoForm.appendChild(dueDate);

    //create submit button
    const saveChangesButton = document.createElement('input');
        saveChangesButton.setAttribute('type', 'submit');
        saveChangesButton.setAttribute('value', 'Add');
        saveChangesButton.setAttribute('id', 'submit-to-do');
        saveChangesButton.addEventListener('click', addNewToDo, false);
        addToDoForm.appendChild(saveChangesButton);
    
    openProject.appendChild(selectedProjectTitle);
    openProject.appendChild(taskList);
    openProject.appendChild(addToDoForm);
    openProjectContainer.appendChild(openProject);

    generateTaskList();
};

//add new to do
function addNewToDo(){
    event.preventDefault();
    const form = document.querySelector('#add-to-do-input');
    const openProjectId = this.parentNode.parentNode.id.replace('-open','');
    const openProjectIndex = projects.findIndex(x => x.name === openProjectId);
    const x = projects[openProjectIndex];
    const newToDoName = document.querySelector('#new-to-do-name');
    const newToDoDueDate = document.querySelector('#new-to-do-due-date');
    const newToDoPriority = document.querySelector('#new-to-do-priority');
    newToDo = new ToDo(newToDoName.value, newToDoDueDate.value, newToDoPriority.value, false);
    x.tasks.push(newToDo);
    localStorage.setItem("storedProjects", JSON.stringify(projects));
    generateTaskList();
    form.reset();
};

//populate task list of selected project
function generateTaskList(){
    const taskList = document.querySelector('#task-list');
    taskList.textContent='';
    //loop through projects and if id of project equals id of openproject div add tasks to task list
    for (let i = 0; i < projects.length; i++) {
        const test = projects[i].name + '-open';
        if (document.getElementById(test)){
            for (let element of projects[i].tasks) {
                const newLi = document.createElement('li');
                    newLi.textContent = element.task + '. ' + element.priority + ', due ' + element.dueDate;
                    newLi.setAttribute('id', element.task);
                const completeTaskButton = document.createElement('button');
                    completeTaskButton.addEventListener('click', completeTask, false);
                const deleteTaskButton = document.createElement('button');
                    deleteTaskButton.textContent ='Delete';
                    deleteTaskButton.addEventListener('click', deleteTask, false);
                const editTaskButton = document.createElement('button');
                    editTaskButton.textContent ='Edit';
                    editTaskButton.addEventListener('click', editTask, false);
                if (element.completed == true){
                    newLi.setAttribute('class', 'completed');
                    completeTaskButton.textContent ='Mark not completed';
                } else {
                    newLi.removeAttribute('class', 'completed');
                    completeTaskButton.textContent ='Mark completed';
                }
                newLi.appendChild(completeTaskButton);
                newLi.appendChild(editTaskButton);
                newLi.appendChild(deleteTaskButton);
                taskList.appendChild(newLi);
            }
        }
    }
};

//complete task
function completeTask(e){
    const openProjectID = e.target.parentNode.parentNode.parentNode.id.replace('-open','');
    const openProjectIndex = projects.findIndex(x => x.name === openProjectID);
    const openProject = projects[openProjectIndex].tasks;
    const completeTaskButton = e.target;
    const taskToEdit = e.target.parentNode;
    const taskToEditID = e.target.parentNode.id;
    const tasktoEditIndex = openProject.findIndex(x => x.task === taskToEditID);
    openProject[tasktoEditIndex].completed = !openProject[tasktoEditIndex].completed;
    taskToEdit.classList.toggle('completed');
    if (completeTaskButton.textContent === "Mark completed") {
        completeTaskButton.textContent = "Mark not completed";
      } else {
        completeTaskButton.textContent = "Mark completed";
      }
    localStorage.setItem("storedProjects", JSON.stringify(projects));
};

//delete task
function deleteTask(e){
    const openProjectId = e.target.parentNode.parentNode.parentNode.id.replace('-open','');
    const taskToDeleteID = e.target.parentNode.id;
    const openProjectIndex = projects.findIndex(x => x.name === openProjectId);
    const openProject = projects[openProjectIndex].tasks;
    for (let element of openProject) {
        if (element.task === taskToDeleteID) {
            const test = openProject.indexOf(element);
            openProject.splice(test, 1);
        } 
    }
    localStorage.setItem("storedProjects", JSON.stringify(projects));
    generateTaskList();
};

//edit task
function editTask(e){
    const openProjectID = e.target.parentNode.parentNode.parentNode.id.replace('-open','');
    const openProjectIndex = projects.findIndex(x => x.name === openProjectID);
    const openProject = projects[openProjectIndex].tasks;
    const taskToEdit = e.target.parentNode;
    const taskToEditID = e.target.parentNode.id;
    const tasktoEditIndex = openProject.findIndex(x => x.task === taskToEditID);
    const taskToEditName = openProject[tasktoEditIndex].task;
    const taskToEditPriority = openProject[tasktoEditIndex].priority;
    const taskToEditDueDate = openProject[tasktoEditIndex].dueDate;
    taskToEdit.textContent = '';

    //create to do edit form
    const editToDoForm = document.createElement('form');
        editToDoForm.setAttribute('id', 'edit-to-do-input');

    const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', taskToEditName);
        input.setAttribute('id', 'edited-to-do-name');
        editToDoForm.appendChild(input);

    //create priority input
    //create array of priority options
    const priority = ["Low priority","Moderate priority","High priority","Immediate priority"];

    //Create and append select list
    const editToDoPriority = document.createElement("select");
        editToDoPriority.setAttribute('id', 'edited-to-do-priority')
        editToDoForm.appendChild(editToDoPriority);

    //Create and append the options
    for (var i = 0; i < priority.length; i++) {
        const option = document.createElement("option");
        option.value = priority[i];
        option.text = priority[i];
        if (option.value === taskToEditPriority) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        editToDoPriority.appendChild(option);
    } 

    //Create due date input and label
    const editDueDate = document.createElement('input');
        editDueDate.setAttribute('type', 'date');
        editDueDate.setAttribute('id', 'edited-to-do-due-date')
        editDueDate.setAttribute('value', taskToEditDueDate);
    
    const dueDateLabel = document.createElement("Label");
        dueDateLabel.setAttribute("for", editDueDate);
        dueDateLabel.textContent = "Due date:";
        
    editToDoForm.appendChild(dueDateLabel);
    editToDoForm.appendChild(editDueDate);

    //create submit button
    const saveChangesButton = document.createElement('input');
        saveChangesButton.setAttribute('type', 'submit');
        saveChangesButton.setAttribute('value', 'Save changes');
        saveChangesButton.setAttribute('id', 'submit-to-do');
        saveChangesButton.addEventListener('click', saveToDoEdits, false);
        editToDoForm.appendChild(saveChangesButton);

    //create discard changes button    
    const discardChangeButton = document.createElement('button');
        discardChangeButton.textContent ='Discard changes';
        discardChangeButton.addEventListener('click', generateTaskList, false);
        editToDoForm.appendChild(discardChangeButton);

    //append edit form to li
    taskToEdit.appendChild(editToDoForm);
};

function saveToDoEdits(e){
    event.preventDefault();
    const openProjectID = e.target.parentNode.parentNode.parentNode.parentNode.id.replace('-open','');
    const openProjectIndex = projects.findIndex(x => x.name === openProjectID);
    const openProject = projects[openProjectIndex].tasks;
    const taskToEdit = e.target.parentNode.parentNode;
    const taskToEditID = e.target.parentNode.parentNode.id;
    const tasktoEditIndex = openProject.findIndex(x => x.task === taskToEditID);

    const editedToDoName = document.querySelector('#edited-to-do-name');
    const editedToDoDueDate = document.querySelector('#edited-to-do-due-date');
    const editedToDoPriority = document.querySelector('#edited-to-do-priority');

    openProject[tasktoEditIndex].task = editedToDoName.value;
    openProject[tasktoEditIndex].priority = editedToDoPriority.value;
    openProject[tasktoEditIndex].dueDate = editedToDoDueDate.value;

    localStorage.setItem("storedProjects", JSON.stringify(projects));
    generateTaskList();
}