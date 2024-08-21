import "./styles.css"
import PubSub from "pubsub-js";
import { createNav, PopUp, Layout, Listing, ProjectCard, TaskCard } from "./load";
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
    function project() {
        const list = common("Projects").project()
        for (let n of Object.values(projectList)) {
            list.appendChild(n.card.getElement())
        }
    };
    function byCreation() {
        const list = common("Tasks").task();
        for (let n of Object.values(taskList)) {
            list.appendChild(n.card.getElement())
        }
    };
    return { project, byCreation }
})()

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

function assignNavCards() {
    const cards = document.querySelectorAll("nav .card");
    for (let n of cards) {
        n.addEventListener("click", (e) => {
            for (let m of cards) m.classList.remove("act")
            e.target.classList.add("act")
            if (e.target.classList.contains("projects")) {
                Layout.createProjectsLayout();
                Buttons.assignProject(ListingController.project);
                ListingController.project();
            }
            else {
                Layout.createTasksLayout();
                Buttons.assignTask(ListingController.byCreation);
                ListingController.byCreation();
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
            ListingController.project()
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
            ListingController.byCreation()
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


createNav()
assignNavCards()
document.querySelector(".card.projects").click()

