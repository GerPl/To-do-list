const actualTasksDisplay = document.querySelector('.actualTask');
const completedTaskDispay = document.querySelector('.completedTask');
const addInput = document.getElementById('addInput');
const addBtn = document.getElementById('addTask');
const addForm = document.querySelector('.add')

let numberId = 0;

//dinamic adding tasks by user
addForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    //getting <template> tag with <li> structure and setting taskName
    if(addInput.value){
        const liTemplate = document.getElementById('actualLiElement');
        const taskTemplate = liTemplate.content.cloneNode(true);
        const task = taskTemplate.querySelector('li');
        const taskName = taskTemplate.querySelector('.taskName');
        taskName.textContent = addInput.value.trim();
        
        numberId++;

        //making each task element as object
        let taskObj = {
            id: `${numberId}`,
            name: taskName.textContent,
            checkbox: taskTemplate.querySelector('.original'),
            label:  taskTemplate.querySelector('.labelCheck'),
            erase: taskTemplate.querySelector('#deleteOne'),
            mark: taskTemplate.querySelector('#highlight'),
            edit: taskTemplate.querySelector('#edit'),
            element: task,
            createdAt: new Date().getTime(),
        }

        task.setAttribute('data-created', taskObj.createdAt)

        //setting Id for checkbox and label equal object id
        taskObj.checkbox.id = taskObj.id;
        taskObj.label.setAttribute('for', taskObj.id)


        addInput.value = '';
        actualTasksDisplay.appendChild(taskObj.element);

        //setting all actual tasks as array of li elements
        const taskArr = [...actualTasksDisplay.children]

        
        taskObj.checkbox.addEventListener('change', ()=>{
            doneTask(taskName, taskObj)
        })
        taskObj.erase.addEventListener('click', ()=>{
            deleteTask(taskObj)
        })
        taskObj.mark.addEventListener('click', ()=>{
            important(taskObj)
        })
        taskObj.edit.addEventListener('click', ()=>{
            changeName(taskObj, taskName)
        })
        const sortSelect = document.getElementById('options')
        sortSelect.addEventListener('change', ()=>{
            sortBy(taskArr, sortSelect)
        })
    }else{
        alert ('add your task')
    }
    }) 

    function doneTask(taskName, taskObj){
        if(taskObj.checkbox.checked){
            actualTasksDisplay.removeChild(taskObj.element)
            const completedTemplate = document.getElementById('completedLiElement')
            const completed = completedTemplate.content.cloneNode(true);
            const completedTask = completed.querySelector('li')
            taskName = completed.querySelector('.completedTaskName');
            taskName.textContent = taskObj.name;
            let completedTaskObj = {
                id: taskObj.id,
                name: taskName.textContent,
                element: completedTask,
                erase: completed.getElementById('deleteOneCompleted') 
            }
            completedTaskDispay.appendChild(completedTaskObj.element)

            completedTaskObj.erase.addEventListener('click', ()=>{
                deleteTask(completedTaskObj)
            })
        }
    }
    function deleteTask(taskObj, completedTaskObj) {
        if (taskObj && taskObj.element) {
            taskObj.element.remove(); 
        }
        if (completedTaskObj && completedTaskObj.element) {
            completedTaskObj.element.remove();
        }
    }

    function important(taskObj){
        const marked = taskObj.element.classList.contains('important');
        if(!marked){
            taskObj.element.classList.add('important')
        }else{
            taskObj.element.classList.remove('important')
        }
    }
    function changeName(taskObj, taskName){
        //creating input for editting task name
        taskObj.edit.style.color = '#e9fcbb'
        const editInput = document.createElement('input')
        editInput.type = 'text'
        editInput.classList.add('edit')
        editInput.setAttribute('placeholder', taskObj.name)
        taskName.replaceWith(editInput)
        editInput.focus()

        //function for editting
        const finish = ()=>{
            const newTaskName  = editInput.value.trim();
                if(newTaskName){
                    taskObj.name = newTaskName;
                    taskName.textContent = newTaskName
                }
                editInput.replaceWith(taskName)
        }
        editInput.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter'){
                finish()
                taskObj.edit.style.color = '#FFA726'
            }
        })
        // editInput.addEventListener('blur', finish)
    }
    function sortBy (taskArr, sortSelect){

        switch(sortSelect.value){
            
            case 'alfabet':
                taskArr.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
                break;
            case 'addTime':
                taskArr.sort((a, b)=>{
                    const aTime = parseInt(a.dataset.created, 10)
                    const bTime = parseInt(b.dataset.created, 10)
                    return aTime - bTime
                })
                break;
            case 'lenght':
                taskArr.sort((a, b) => a.textContent.length - b.textContent.length); 
                break;
            
            case 'none':
                default:
                return;

        }
        actualTasksDisplay.innerHTML = '';
        taskArr.forEach(task => actualTasksDisplay.appendChild(task));
    }
    