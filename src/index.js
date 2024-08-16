import "./styles.css"
import { createNav, PopUp } from "./load";

class Task {
    constructor(title, description, date, priority, notes, check) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.notes = notes;
        this.check = check;
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
const elem = PopUp.createCommon("task");
console.log(elem)
