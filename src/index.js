import "./styles.css"
import PubSub from "pubsub-js";
import { createNav, PopUp, Layout, Listing, ProjectCard } from "./load";

window.taskList = [];
window.projectList = [];

class Task {
    constructor(title, description, date, priority, notes, check, project) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.notes = notes;
        this.check = check;
        this.project = project;
    }
}

class Project {
    constructor(title, description, hide) {
        this.title = title; 
        this.description = description;
        this.hide = hide;
        this.tasks = [];

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
                Buttons.assignProject()
            }
            else {
                Layout.createTasksLayout()
                Buttons.assignTask()
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
            // defaultProject here until project selection is created
            let task = new Task(formData.get("title"), formData.get("description"), formData.get("date") ? formData.get("date") : "E" , formData.get("priority"), null, null, defaultProject)
            taskList.push(task);
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
    static project() {
        const listing = new Listing("Projects")
        const list = listing.project();
        for (let n of projectList) {
            list.appendChild(n.card.getElement())
        }
    }
}

createNav()
assignNavCards()
document.querySelector(".card.projects").click()

// createProject()


