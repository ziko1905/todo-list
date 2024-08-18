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

createNav()
console.log(await Layout.createTasksLayout(PopUp.createTask))
await Layout.createProjectsLayout(PopUp.createProject)