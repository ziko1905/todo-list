import "./styles.css"
import PubSub from "pubsub-js";
import { createNav, PopUp, Layout } from "./load";

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
    constructor(title, description) {
        this.title = title; 
        this.description = description;
        this.tasks = [];
    }
}

function assignNavCards() {
    const cards = document.querySelectorAll("nav .card");
    for (let n of cards) {
        n.addEventListener("click", (e) => {
            for (let m of cards) m.classList.remove("act")
            e.target.classList.add("act")
            if (e.target.classList.contains("projects")) {
                Layout.createProjectsLayout()
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
        stop.remove()  
    }

    static async task() {
        const stop = document.createElement("div");
        stop.className = "stop-all";
        document.body.insertBefore(stop, document.body.firstChild);

        let formData = await PopUp.createTask()
        stop.remove()  
    }
}

const Buttons = (function () {
    function assignProject() {
        let newBtn = document.querySelector(".new-btn")
        let removeBtn = document.querySelector(".remove-btn")

        newBtn.addEventListener("click", MakeNew.project)
    }

    function assignTask() {
        let newBtn = document.querySelector(".new-btn")
        let removeBtn = document.querySelector(".remove-btn")

        newBtn.addEventListener("click", MakeNew.task)
    }

    return { assignProject, assignTask }
})()

createNav()
assignNavCards()
// createProject()


