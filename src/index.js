import "./styles.css"
import PubSub from "pubsub-js";
import { createFixedNavs, PopUp, Layout, Listing, ProjectCard, TaskCard } from "./load";
import { nextDay } from "date-fns";
import stringify from "json-stringify-safe";

export let taskList = {};
export let projectList = {};
window.taskList = taskList;
window.projectList = projectList;

export const ListingController = (function () {
    let oldTitle = null;
    function common(title) {
        oldTitle = title ? title : oldTitle;
        const listing = new Listing(oldTitle)
        return listing;
    };
    function project(objList) {
        const listing = common("Projects")
        listing.clearProjects()
        const insertList = listing.project()
        for (let n of objList) {
            if (n.id) insertList.appendChild(n.card.getElement())
            else continue
            n.card.listingFunct = () => project(Sorting.getAll(projectList))
        }
    };
    function task(objList, sortAlg) {
        objList = sortAlg(objList);
        const listing = common("Tasks");
        listing.clearTasks()
        const insertList = listing.task();
        for (let n of objList) {
            insertList.appendChild(n.card.getElement())
            n.card.listingFunct = () => ListingController.task(taskList, sortAlg)
        }
    };
    function fromProject(objList, sortAlg) {
        objList = sortAlg(objList);
        const listing = common("Tasks");
        listing.clearProjects()
        const insertList = listing.task();
        for (let n of objList) {
            insertList.appendChild(n.card.getElement())
            n.card.listingFunct = () => ListingController.task(objList, sortAlg)
        }
    }
    return { project, task, fromProject }
})()

export class Sorting {
    static getAll(list) {
        return Object.values(list)
    }
    static getDone(list) {
        return Object.values(list).filter(n => n.checked)
    }
    static getToDo(list) {
        return Object.values(list).filter(n => !n.checked)
    }
}

class Task {
    static nextId = 0;
    constructor() {
        this.checked = false;
        this.id = Task.nextId;
        Task.nextId++;
        taskList[this.id] = this;
    }
    edit(formData, funct) {
        if (formData) {
            this.title = formData.get("title") ? formData.get("title") : this.title;
            this.description = formData.get("description") ? formData.get("description") : this.description;
            this.date = formData.get("every-day") ? "E" : formData.get("date") ? formData.get("date") : "E";
            this.priority = formData.get("priority");
            if (formData.has("project")) this.project = formData.get("project") ? projectList[formData.get("project")] : projectList[0]; 
        }
        console.log(this)
        this.project.tasks[this.id] = this;
        this.projectId = this.project.id;
        this.card = new TaskCard(this, funct);
        funct()
        saveStorage()
    }
    triggerCheck() {
        this.checked = !this.checked;
        this.card.listingFunct();
        saveStorage()
    }
    remove(direct) {
        delete this.project.tasks[this.id]
        delete taskList[this.id]
        if (direct) this.card.listingFunct();
        saveStorage()
    }
    create(title, description, date, priority, projectId, id, checked) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.projectId = projectId;
        delete taskList[this.id]
        this.id = id;
        taskList[this.id] = this;
        this.checked = checked;
    }
    save() {
        return [this.title, this.description, this.date, this.priority, this.projectId, this.id, this.checked]
    }
    assignCard() {
        console.log("Assign")
        this.card = new TaskCard(this, () => ListingController.task(taskList, Sorting.getAll))
        if (this.checked)
            this.card.check(true)
    }
}

class Project {
    static nextId = 0;
    constructor(hide) {
        this.hide = hide;
        this.tasks = {};
        this.id = Project.nextId;
        Project.nextId++
        if (!this.hide) this.link()
    }
    edit(formData, funct) {
        if (formData) {
            this.title = formData.get("title") ? formData.get("title") : this.title;
            this.description = formData.get("description") ? formData.get("description") : this.description;
        }
        this.card = new ProjectCard(this, funct);
        funct()
        saveStorage()
    }
    link() {
        projectList[this.id] = this;
    }
    remove() {
        for (let n of Object.values(this.tasks)) {
            n.remove()
        }
        delete projectList[this.id];
        this.card.listingFunct()
        saveStorage()
    }
    create(title, description, id) {
        this.title = title;
        this.description = description;
        delete projectList[this.id]
        this.id = id;
        this.tasks = {};
        projectList[this.id] = this;
    }
    save() {
        return [this.title, this.description, this.id]
    }
    assignCard() {
        if (this.id != 0) this.card = new ProjectCard(this, () => ListingController.project(Sorting.getAll(projectList)))
    }
}

//Project for all generic tasks

let defaultProject;
console.log(localStorage.getItem("projects"));
if (!localStorage.getItem("projects")) {
    defaultProject = new Project(true);
    projectList[0] = defaultProject;
    }
else {
    defaultProject = projectList[0];
}

loadStorage()


function assignFixedNavCards() {
    const cards = document.querySelectorAll("nav .card");
    for (let n of cards) {
        n.addEventListener("click", (e) => {
            for (let m of cards) m.classList.remove("act")
            e.target.classList.add("act")
            if (e.target.classList.contains("projects")) {
                Layout.createProjectsLayout();
                Buttons.assignProject(() => ListingController.project(Sorting.getAll(projectList)));
                ListingController.project(Sorting.getAll(projectList));
            }
            else if (e.target.classList.contains("todo")) {
                Layout.createTasksLayout();
                Buttons.assignTask(() => ListingController.task(taskList, Sorting.getToDo));
                ListingController.task(taskList, Sorting.getToDo);
            }
            else if (e.target.classList.contains("done")) {
                Layout.createTasksLayout();
                Buttons.assignTask(() => ListingController.task(taskList, Sorting.getDone));
                ListingController.task(taskList, Sorting.getDone);
             }
            else {
                Layout.createTasksLayout();
                Buttons.assignTask(() => ListingController.task(taskList, Sorting.getAll));
                ListingController.task(taskList, Sorting.getAll);
            }
        })
    }
}

class MakeNew {
    static async project(listingFunct) {
        const stop = document.createElement("div");
        stop.className = "stop-all";
        document.body.insertBefore(stop, document.body.firstChild);

        let formData = await PopUp.createProject()

        if (formData) {
            let project = new Project()
            project.edit(formData, listingFunct);
            listingFunct()
        }
        stop.remove()  
    }

    static async task(listingFunct) {
        const stop = document.createElement("div");
        stop.className = "stop-all";
        document.body.insertBefore(stop, document.body.firstChild);

        let formData = await PopUp.createTask()
        if (formData) {
            let task = new Task();
            task.edit(formData, listingFunct);
            listingFunct()
        }
        stop.remove()  
    }
}

const Buttons = (function () {
    // Cant use buttons outside function scope bcs IIFE gets called before buttons are created
    function assignProject(listingFunct) {
        const newBtn = document.querySelector(".new-btn");
        const removeBtn = document.querySelector(".remove-btn");

        newBtn.addEventListener("click", () => MakeNew.project(listingFunct));
        removeBtn.addEventListener("click", () => {
            const cards = document.querySelectorAll(".remove");
            if (cards) {
                for (let n of cards) {
                    projectList[n.getAttribute("data-obj-id")].remove()
                }
            }        
        })
    }

    function assignTask(listingFunct) {
        const newBtn = document.querySelector(".new-btn");
        const removeBtn = document.querySelector(".remove-btn");

        newBtn.addEventListener("click", () => MakeNew.task(listingFunct));
        removeBtn.addEventListener("click", () => {
            const cards = document.querySelectorAll(".remove");
            if (cards) {
                for (let n of cards) {
                    console.log(n);
                    taskList[n.getAttribute("data-obj-id")].remove(true)
                }
            }    
        })

    }

    return { assignProject, assignTask }
})()

function saveStorage() {
    if (projectList) localStorage.setItem("projects", JSON.stringify(Object.values(projectList).map((n) => n.save())));
    if (taskList) localStorage.setItem("tasks", JSON.stringify(Object.values(taskList).map((m) => m.save())));
    if (Project.nextId) localStorage.setItem("projectNextId", JSON.stringify(Project.nextId));
    if (Task.nextId) localStorage.setItem("taskNextId", JSON.stringify(Task.nextId));
}

function loadStorage() {
    if (localStorage.getItem("projectNextId")) Project.nextId = localStorage.getItem("projectNextId");
    if (localStorage.getItem("taskNextId")) Task.nextId = localStorage.getItem("taskNextId");
    
    if (localStorage.getItem("projects")) {    
        for (let n of JSON.parse(localStorage.getItem("projects"))) {
            let prj = new Project();
            prj.create(...n)
        }
    }
    console.log(projectList);
    if (localStorage.getItem("tasks")) {    
        for (let m of JSON.parse(localStorage.getItem("tasks"))) {
            let tsk = new Task();
            tsk.create(...m)
        }
    }
    console.log(taskList);
    linkTaskProject()
    for (let tsk of Object.values(taskList)) tsk.assignCard()
    for (let prj of Object.values(projectList)) prj.assignCard()

}

function linkTaskProject() {
    for (let tsk of Object.values(taskList)) {
        console.log(typeof tsk)
        tsk.project = projectList[tsk.projectId]
        console.log(projectList)
        tsk.project.tasks[tsk.id] = tsk;
    }
}

createFixedNavs()
assignFixedNavCards()
document.querySelector(".card.tasks").click()

