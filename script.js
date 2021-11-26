const form = document.querySelector('#new-project-input');
const newProjectButton = document.querySelector('#new-project-button');
const newProjectName = document.querySelector('#new-project-name');
const projectList = document.querySelector('#project-list');
const openProjectContainer = document.querySelector('#open-project-container');
let projects = [];

//constructors
class ToDo {
    constructor(task, dueDate, priority){
        this.task = task
        this.dueDate = dueDate
        this.priority = priority
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
    defaultProject = new Project('default', []);
    projects.push(defaultProject)
    generateProjectList(projectList, projects);
}

addDefaultProject();


//add new projects
newProjectButton.addEventListener('click', createProject, false);

function createProject() {
    event.preventDefault();
    newProject = new Project(newProjectName.value, []);
    projects.push(newProject)
    generateProjectList(projectList, projects)
};

//populate list of projects
function generateProjectList(projectList, projects) {
    projectList.innerHTML = '';
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
    generateProjectList(projectList, projects); 
    openProjectContainer.innerHTML='';
};

//open project to show to-dos
function displayProject(e){
    openProjectContainer.innerHTML = '';

    const openProject = document.createElement('div');
        openProject.setAttribute('id', e.target.parentNode.id+'-open');

    const selectedProjectTitle = document.createElement('h2');
        selectedProjectTitle.textContent = e.target.parentNode.id;

    const taskList = document.createElement('ol');
        taskList.setAttribute('id', 'task-list');

    const addToDoForm = document.createElement('form');
        addToDoForm.setAttribute('id', 'add-to-do-input');

    const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'New to-do');
        input.setAttribute('id', 'new-to-do-name');
        addToDoForm.appendChild(input);

    const dueDate = document.createElement('input');
        dueDate.setAttribute('type', 'date');
        dueDate.setAttribute('placeholder', 'Due date');
        dueDate.setAttribute('id', 'new-to-do-due-date');
        addToDoForm.appendChild(dueDate);

    //create array of priority options
    const priority = ["Low","Moderate","High","Immediate"];

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

    const submitButton = document.createElement('input');
        submitButton.setAttribute('type', 'submit');
        submitButton.setAttribute('value', 'Add');
        submitButton.setAttribute('id', 'submit-to-do');
        submitButton.addEventListener('click', addNewToDo, false);
        addToDoForm.appendChild(submitButton);
    
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
    newToDo = new ToDo(newToDoName.value, newToDoDueDate.value, newToDoPriority.value);
    x.tasks.push(newToDo);
    generateTaskList();
    form.reset();
    console.log(projects);
};

//populate task list of selected project
function generateTaskList(){
    const taskList = document.querySelector('#task-list');
    taskList.innerHTML='';
    //loop through projects and if id of project equals id of openproject div add tasks to task list
    for (let i = 0; i < projects.length; i++) {
        const test = projects[i].name + '-open';
        if (document.getElementById(test)){
            for (let element of projects[i].tasks) {
                const newLi = document.createElement('li');
                    newLi.textContent = element.task + '. ' + element.priority + ' priority' + ' due ' + element.dueDate;
                    newLi.setAttribute('id', element.task);
                const deleteTaskButton = document.createElement('button');
                    deleteTaskButton.textContent ='Delete';
                    deleteTaskButton.addEventListener('click', deleteTask, false);
                /* newLi.addEventListener('click', openToDoDetails, false); */
                newLi.appendChild(deleteTaskButton);
                taskList.appendChild(newLi);
            }
        }
    }
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
    generateTaskList();
};

//show todo details and add date/priority
/* function openToDoDetails(){
    alert('hello');
}; */