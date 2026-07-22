const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const FILE = "tasks.json";

// Read Tasks
function readTasks() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(FILE));
}

// Save Tasks
function saveTasks(tasks) {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

// Get All Tasks
app.get("/tasks", (req, res) => {
    res.json(readTasks());
});

// Add Task
app.post("/tasks",(req,res)=>{

    const tasks=readTasks();

    const newTask={

        id:Date.now(),

        name:req.body.name,

        dueDate:req.body.dueDate,

        priority:req.body.priority,

        completed:false

    };

    tasks.push(newTask);

    saveTasks(tasks);

    res.json(newTask);

});

// Complete Task
app.put("/tasks/:id",(req,res)=>{

    const tasks=readTasks();

    const task=tasks.find(t=>t.id==req.params.id);

    if(task){

        task.completed=true;

    }

    saveTasks(tasks);

    res.json(task);

});

// Update Task
app.put("/tasks/:id", (req, res) => {

    const tasks = readTasks();

    const task = tasks.find(t => t.id == req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    task.name = req.body.name;
    task.dueDate = req.body.dueDate;
    task.priority = req.body.priority;
    task.completed = req.body.completed;

    saveTasks(tasks);

    res.json(task);

});

// Delete Task
app.delete("/tasks/:id",(req,res)=>{

    let tasks=readTasks();

    tasks=tasks.filter(t=>t.id!=req.params.id);

    saveTasks(tasks);

    res.json({message:"Deleted"});

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});