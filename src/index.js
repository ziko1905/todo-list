import "./styles.css"

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