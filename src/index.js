import "./styles.css"
import PubSub from "pubsub-js";
import { createFixedNavs, PopUp, Layout, Listing, ProjectCard, TaskCard } from "./load";
import { nextDay } from "date-fns";

export let taskList = {};
export let projectList = {};

const ListingController = (function () {
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
            insertList.appendChild(n.card.getElement())
        }
    };
    function task(objList, sortAlg) {
        objList = sortAlg(objList);
        const listing = common("Tasks");
        listing.clearTasks()
        const insertList = listing.task();
        for (let n of objList) {
            insertList.appendChild(n.card.getElement())
            n.card.listingFunct = () => ListingController.task(objList, sortAlg)
        }
    };
    return { project, task }
})()

class Sorting {
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
            this.project = formData.get("project") ? projectList[formData.get("project")] : defaultProject; 
        }
        this.project.tasks[this.id] = this;
        this.card = new TaskCard(this, funct);
        funct()
    }
    triggerCheck() {
        this.checked = !this.checked;
        this.card.listingFunct();
    }
    remove(direct) {
        delete this.project.tasks[this.id]
        delete taskList[this.id]
        if (direct) this.card.listingFunct();
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
    }
}

//Project for all generic tasks
const defaultProject = new Project(true);

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
        const plusBtn = document.querySelector("#add");

        newBtn.addEventListener("click", () => MakeNew.project(listingFunct));
        plusBtn.addEventListener("click",() => MakeNew.project(listingFunct));
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
        const plusBtn = document.querySelector("#add");

        newBtn.addEventListener("click", () => MakeNew.task(listingFunct));
        plusBtn.addEventListener("click", () => MakeNew.task(listingFunct));
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


createFixedNavs()
assignFixedNavCards()
document.querySelector(".card.projects").click()

