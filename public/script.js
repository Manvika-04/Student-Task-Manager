const API = "/tasks";

// ==========================
// LOAD TASKS
// ==========================

async function loadTasks() {

    const response = await fetch(API);

    const tasks = await response.json();

    displayTasks(tasks);

    updateDashboard(tasks);

}

// ==========================
// DISPLAY TASKS
// ==========================

function displayTasks(tasks){

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const dueClass =
            task.dueDate && new Date(task.dueDate) < new Date()
                ? "expired"
                : "future";

        taskList.innerHTML += `
        <tr>

            <td>${task.name}</td>

            <td>
                <span class="${dueClass}">
                    ${task.dueDate || "-"}
                </span>
            </td>

            <td>
                <span class="${(task.priority || "Low").toLowerCase()}">
                    ${task.priority || "Low"}
                </span>
            </td>

            <td class="${task.completed ? "completed" : "pending"}">
                ${task.completed ? "Completed" : "Pending"}
            </td>

            <td>

                <button class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✏️
                </button>

                ${
                    !task.completed
                    ? `<button class="complete-btn"
                        onclick="completeTask(${task.id})">
                        ✔
                    </button>`
                    : ""
                }

                <button class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑
                </button>

            </td>

        </tr>
        `;

    });

}

// ==========================
// DASHBOARD
// ==========================

function updateDashboard(tasks){

    const total=tasks.length;

    const completed=
    tasks.filter(t=>t.completed).length;

    const pending=
    total-completed;

    document.getElementById("totalTasks").innerHTML=total;

    document.getElementById("completedTasks").innerHTML=completed;

    document.getElementById("pendingTasks").innerHTML=pending;

    let percent=0;

    if(total>0){

        percent=(completed/total)*100;

    }

    const bar = document.getElementById("progressBar");
    bar.style.width = percent + "%";
    bar.innerHTML = Math.round(percent) + "%";

    document.getElementById("progressBar").innerHTML=Math.round(percent)+"%";

    if(typeof updateChart==="function"){

        updateChart(completed,pending);

    }

    let celebrationShown = false;
     
    function celebrateTasks(tasks){

    const completed = tasks.filter(t => t.completed).length;

    if(tasks.length > 0 && completed === tasks.length){

        if(!celebrationShown){
            celebrate();
            celebrationShown = true;
        }

    }else{

        celebrationShown = false;

    }

}

}

// ==========================
// SEARCH
// ==========================

document.getElementById("searchInput")
.addEventListener("keyup",function(){

let value=this.value.toLowerCase();

document.querySelectorAll("#taskList tr")
.forEach(row=>{

row.style.display=
row.innerText.toLowerCase()
.includes(value)
?""
:"none";

});

});

// ==========================
// ADD TASK
// ==========================

async function addTask(){

    console.log("Add Task Button Clicked");   

    const taskInput=document.getElementById("taskInput");
    const dueDate=document.getElementById("dueDate");
    const priority=document.getElementById("priority");

    if(taskInput.value.trim()==""){

        showToast("Please Enter a Task","warning");

        return;

    }

    await fetch(API,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            name:taskInput.value,

            dueDate:dueDate.value,

            priority:priority.value

        })

    });

    taskInput.value="";
    dueDate.value="";
    priority.value="Medium";

    loadTasks();

    showToast("Task Added Successfully","success");

}

// ==========================
// COMPLETE TASK
// ==========================

async function completeTask(id){

    await fetch(API+"/"+id,{

        method:"PUT"

    });

    loadTasks();

    showToast("Task Completed","success");

}

// ==========================
// DELETE TASK
// ==========================

async function deleteTask(id){

    await fetch(API+"/"+id,{

        method:"DELETE"

    });

    loadTasks();

    showToast("Task Deleted","error");

}

// ==========================
// EDIT TASK
// ==========================

async function editTask(id){

    const response = await fetch(API);

    const tasks = await response.json();

    const task = tasks.find(t => t.id === id);

    if(!task) return;

    const name = prompt("Edit Task Name", task.name);

    if(name === null) return;

    const dueDate = prompt("Edit Due Date (YYYY-MM-DD)", task.dueDate);

    if(dueDate === null) return;

    const priority = prompt(
        "Priority (High / Medium / Low)",
        task.priority
    );

    if(priority === null) return;

    await fetch(API + "/" + id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            id:task.id,

            name:name,

            dueDate:dueDate,

            priority:priority,

            completed:task.completed

        })

    });

    loadTasks();

    showToast("Task Updated Successfully","success");

}

// ==========================
// TOAST
// ==========================

function showToast(message,type="success"){

    const toast=document.createElement("div");

    toast.className="toast "+type;

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },500);

    },2500);

}

// ==========================
// LIVE CLOCK
// ==========================

function updateClock(){

    const now=new Date();

    const date=now.toLocaleDateString();

    const time=now.toLocaleTimeString();

    document.getElementById("clock").innerHTML=

    `<i class="fa-solid fa-clock"></i>

    ${date}

    ${time}`;

}

setInterval(updateClock,1000);

updateClock();

// ==========================
// DARK MODE
// ==========================

const themeBtn = document.getElementById("themeBtn");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';

    }

});

// ==========================
// UPDATE CHART
// ==========================

function refreshChart(tasks){

    let completed=tasks.filter(t=>t.completed).length;

    let pending=tasks.length-completed;

    if(typeof updateChart==="function"){

        updateChart(completed,pending);

    }

}

// ==========================
// DUE DATE CHECK
// ==========================

function checkDueDate(task){

    if(!task.dueDate) return "future";

    const today=new Date();

    today.setHours(0,0,0,0);

    const due=new Date(task.dueDate);

    due.setHours(0,0,0,0);

    if (due.getTime() < today.getTime()) {
    return "expired";
}
return "future";
}

// ==========================
// PRIORITY COLORS
// ==========================

function getPriority(priority){

    switch(priority){

        case "High":
            return "high";

        case "Medium":
            return "medium";

        case "Low":
            return "low";

        default:
            return "low";

    }

}

// ==========================
// AUTO REFRESH
// ==========================

setInterval(()=>{

    loadTasks();

},30000);

// ==========================
// CELEBRATION
// ==========================

function celebrateTasks(tasks){

    if(tasks.length===0) return;

    const completed=tasks.filter(t=>t.completed).length;

    if(completed===tasks.length){

        if(typeof celebrate==="function"){

            celebrate();

        }

        showToast("🎉 Congratulations! All Tasks Completed","success");

    }

}

// ==========================
// DASHBOARD REFRESH
// ==========================

async function refreshDashboard(){

    const response=await fetch(API);

    const tasks=await response.json();

    updateDashboard(tasks);

    refreshChart(tasks);

    celebrateTasks(tasks);

}

// ==========================
// INITIAL LOAD
// ==========================

window.onload=function(){

    loadTasks();

    updateClock();

}

// ==========================
// SAVE DARK MODE
// ==========================

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark");

    if(document.getElementById("themeBtn")){

        document.getElementById("themeBtn").innerHTML =
        '<i class="fa-solid fa-sun"></i>';

    }

}

const themeButton = document.getElementById("themeBtn");

if(themeButton){

    themeButton.addEventListener("click",()=>{

        if(document.body.classList.contains("dark")){

            localStorage.setItem("theme","dark");

        }

        else{

            localStorage.setItem("theme","light");

        }

    });

}

// ==========================
// ENTER KEY SUPPORT
// ==========================

const taskInput = document.getElementById("taskInput");

if(taskInput){

    taskInput.addEventListener("keypress",function(e){

        if(e.key==="Enter"){

            addTask();

        }

    });

}

// ==========================
// PAGE LOADING ANIMATION
// ==========================

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    setTimeout(()=>{

        document.body.style.transition="opacity .8s";

        document.body.style.opacity="1";

    },100);

});

// ==========================
// CLEAR COMPLETED TASKS
// ==========================

async function clearCompleted(){

    const response = await fetch(API);

    const tasks = await response.json();

    for(const task of tasks){

        if(task.completed){

            await fetch(API+"/"+task.id,{

                method:"DELETE"

            });

        }

    }

    loadTasks();

    showToast("Completed Tasks Cleared","success");

}

// ==========================
// TASK COUNTER
// ==========================

function taskSummary(tasks){

    console.log("Total :",tasks.length);

    console.log("Completed :",tasks.filter(t=>t.completed).length);

    console.log("Pending :",tasks.filter(t=>!t.completed).length);

}

// ==========================
// REFRESH EVERY 60 SECONDS
// ==========================

setInterval(async()=>{

    const response=await fetch(API);

    const tasks=await response.json();

    taskSummary(tasks);

},60000);

// ==========================
// START APPLICATION
// ==========================

document.addEventListener("DOMContentLoaded",()=>{

    loadTasks();

    updateClock();

    console.log("✅ Student Task Manager Loaded Successfully");

});