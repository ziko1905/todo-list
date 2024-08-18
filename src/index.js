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
        n.addEventListener("click", async (e) => {
            for (let m of cards) m.classList.remove("act")
            e.target.classList.add("act")
            if (e.target.classList.contains("projects")) {
                await Layout.createProjectsLayout(PopUp.createProject)
            }
            else {
                await Layout.createTasksLayout(PopUp.createTask)
            }
            
        })
    }
}

createNav()
assignNavCards()


