import "./styles.css"
import PubSub from "pubsub-js";
import { createNav, PopUp, Layout, Listing, ProjectCard, TaskCard } from "./load";

export let taskList = [];
export let projectList = [];

class Task {
    constructor() {
        this.checked = false;
    }
    edit(formData) {
        if (formData) {
            this.title = formData.get("title") ? formData.get("title") : this.title;
            this.description = formData.get("description") ? formData.get("description") : this.description;
            this.date = formData.get("every-day") ? "E" : formData.get("date") ? formData.get("date") : "E";
            this.priority = formData.get("priority");
            this.project = formData.get("project") ? projectList[formData.get("project")] : defaultProject; 
            console.log(this.project);
        }
        this.card = new TaskCard(this);
        ListingController.byCreation()
    }
}

class Project {
    constructor(title, description, hide) {
        this.title = title; 
        this.description = description;
        this.hide = hide;
        this.tasks = [];
    }
    edit(formData) {
        if (formData) {
            this.title = formData.get("title") ? formData.get("title") : this.title;
            this.description = formData.get("description") ? formData.get("description") : this.description;
        }
        this.card = new ProjectCard(this);
        ListingController.project()
    }
}

const defaultProject = new Project("Main", "This is main project for all generic tasks.", false);

function assignNavCards() {
    const cards = document.querySelectorAll("nav .card");
    for (let n of cards) {
        n.addEventListener("click", (e) => {
            for (let m of cards) m.classList.remove("act")
            e.target.classList.add("act")
            if (e.target.classList.contains("projects")) {
                Layout.createProjectsLayout();
                Buttons.assignProject();
                ListingController.project();
            }
            else {
                Layout.createTasksLayout();
                Buttons.assignTask();
                ListingController.byCreation();
            }
            
        })
    }
}
class MakeNew {
    static async project() {
        const stop = document.createElement("div");
        stop.className = "stop-all";
        document.body.insertBefore(stop, document.body.firstChild);

        let formData = await PopUp.createProject()

        if (formData) {
            let project = new Project(formData.get("title"), formData.get("description"), false)
            project.card = new ProjectCard(project);
            projectList.push(project);
            ListingController.project()
        }
        stop.remove()  
    }

    static async task() {
        const stop = document.createElement("div");
        stop.className = "stop-all";
        document.body.insertBefore(stop, document.body.firstChild);

        let formData = await PopUp.createTask()
        if (formData) {
            let task = new Task();
            task.edit(formData);
            taskList.push(task);
            ListingController.byCreation()
        }
        stop.remove()  
    }
}

const Buttons = (function () {
    // Cant use buttons outside function scope bcs IIFE gets called before buttons are created
    function assignProject() {
        const newBtn = document.querySelector(".new-btn");
        const removeBtn = document.querySelector(".remove-btn");
        const plusBtn = document.querySelector("#add");

        newBtn.addEventListener("click", MakeNew.project);
        plusBtn.addEventListener("click", MakeNew.project);
    }

    function assignTask() {
        const newBtn = document.querySelector(".new-btn");
        const removeBtn = document.querySelector(".remove-btn");
        const plusBtn = document.querySelector("#add");

        newBtn.addEventListener("click", MakeNew.task);
        plusBtn.addEventListener("click", MakeNew.task);

    }

    return { assignProject, assignTask }
})()

class ListingController {
    constructor() {
        this.oldTitle = null;
    }
    static common(title) {
        this.oldTitle = title ? title : this.oldTitle;
        const listing = new Listing(this.oldTitle)
        return listing;
    }
    static project() {
        const list = this.common("Projects").project()
        for (let n of projectList) {
            list.appendChild(n.card.getElement())
        }
    }
    static byCreation() {
        const list = this.common("Tasks").task();
        for (let n of taskList) {
            list.appendChild(n.card.getElement())
        }
    }
}

createNav()
assignNavCards()
document.querySelector(".card.projects").click()

