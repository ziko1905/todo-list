import PubSub from "pubsub-js";
const content = document.querySelector(".content")

export function createNav() {
    const nav = document.querySelector("nav");
    let cards = [];
    for (let n of ["Projects", "Today", "By Importance", "By Date", "By Creation"]) {
        const card = document.createElement("div")
        card.classList.add("card")
        if (n == "Projects") card.classList.add("projects")
        else card.classList.add("tasks")
        card.textContent = n;
        cards.push(card);
        nav.appendChild(card);
    }
}

export const Layout = (function () {
    let returnVal;
    let _promote;
    const content = document.querySelector(".content")
    let addBtn = document.createElement("button")
    let removeBtn = document.createElement("button");
    const listingDiv = document.createElement("div");
    // Initializing mainDiv to dummy div to make creation code simpler
    let mainDiv = document.createElement("div");

    addBtn.className = "new-btn";
    removeBtn.className = "remove-btn";

    function createCommonLayout() {
        content.textContent = ""
        addBtn = addBtn.cloneNode(true);
        removeBtn = removeBtn.cloneNode(true);
        const btnsDiv = document.createElement("div");

        listingDiv.textContent = "";
        btnsDiv.className = "btns-div";
        btnsDiv.appendChild(addBtn);
        btnsDiv.appendChild(removeBtn);
        content.appendChild(btnsDiv);
        content.appendChild(listingDiv);

        content.appendChild(mainDiv)
    }

    function createProjectsLayout() {
        createCommonLayout()
        addBtn.textContent = "New Project";
        removeBtn.textContent = "Remove Project";
        listingDiv.className = "projects-lst";

        return listingDiv
    }

    function createTasksLayout() {
        createCommonLayout()
        addBtn.textContent = "New Task";
        removeBtn.textContent = "Remove Task";
        listingDiv.className = "tasks-lst";

        return listingDiv
    }
    return { createProjectsLayout, createTasksLayout }
})()

class Card {
    constructor(obj, listingFunct) {
        this.div = document.createElement("div");
        this.obj = obj;
        this.listingFunct = listingFunct;
        this.editBtn = document.createElement("button")
        this.createCard();
    }

    createCard() {
        const title = document.createElement("h2");
        const desc = document.createElement("p");
        
        title.textContent = this.obj.title;
        desc.textContent = this.obj.description;
        this.editBtn.textContent = "Edit";
        this.editBtn.className = "edit-btn"

        this.div.appendChild(title);
        this.div.appendChild(desc);
        this.div.appendChild(this.editBtn);
    }

    edit() {
        this.div.textContent = "";
        const editForm = document.createElement("form");
        const titleInput = document.createElement("input");
        const descInput = document.createElement("textarea");
        const buttonsDiv = document.createElement("div");
        const submitBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        titleInput.setAttribute("placeholder", this.obj.title);
        titleInput.required = true;
        descInput.className = "desc";
        descInput.setAttribute("placeholder", this.obj.description);
        buttonsDiv.className = "form-btns";
        submitBtn.textContent = "Ok";
        cancelBtn.textContent = "Cancel";
        submitBtn.className = "submit-btn";
        cancelBtn.className = "cancel-btn"
        
        buttonsDiv.appendChild(submitBtn);
        buttonsDiv.appendChild(cancelBtn);
        editForm.appendChild(titleInput);
        editForm.appendChild(descInput);
        editForm.appendChild(buttonsDiv);
        this.div.appendChild(editForm);
    }

    getElement() {
        return this.div
    }
}

export class ProjectCard extends Card {
    constructor(project, listingFunct) {
        super(project, listingFunct)
        this.div.className = "project-card";
        this.editBtn.addEventListener("click", () => this.editProjectCard())
    }
    editProjectCard() {
        super.edit()
    }
}

export class TaskCard extends Card {
    constructor(task, listingFunct) {
        super(task, listingFunct)
        this.div.className = "task-card"
        this.createTaskSpecific();
    }

    createTaskSpecific() {
        const dueDate = document.createElement("p");
        dueDate.className = "due-date";
        dueDate.textContent = "Due date: ";
        this.div.classList.add(this.obj.priority)
        if (this.obj.date == "E") dueDate.textContent += "Today";

        this.div.appendChild(dueDate);
    }

}

export const PopUp = (function () {
    let form;
    let legend;
    let _promote;
    let returnVal;
    function createCommon() {
        form = document.createElement("form");
        legend = document.createElement("legend");
        const popDiv = document.createElement("div");
        const titleLabel = document.createElement("label");
        const titleInput = document.createElement("input");
        const descDiv = document.createElement("div");
        const descLabel = document.createElement("label");
        const description = document.createElement("textarea");

        legend.textContent = "Add "
        popDiv.className = "pop";
        titleLabel.textContent = "Name: "; 
        titleLabel.setAttribute("for", "title");
        titleLabel.className = "title-lab";
        titleInput.id = "title";
        titleInput.setAttribute("name", "title");
        titleInput.required = true;
        titleInput.className = "title-inp";
        descDiv.className = "desc-div";
        descLabel.textContent = "Description: ";
        descLabel.setAttribute("for", "description");
        description.className = "desc";
        description.id = "description";
        description.name = "description";

        descDiv.appendChild(descLabel);
        descDiv.appendChild(description);

        form.appendChild(titleLabel);
        form.appendChild(titleInput);
        form.appendChild(descDiv);

        const submitBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");
        const btnsDiv = document.createElement("div");

        btnsDiv.className = "btn-div";
        submitBtn.textContent = "Add";
        submitBtn.className = "submit-btn";
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "cancel-btn";

        submitBtn.addEventListener("click", (e) => {
            e.preventDefault()
            if (form.reportValidity()) {
                popDiv.remove()
                returnVal = new FormData(form);
                _promote();
            }
        })

        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault()
            popDiv.remove()
            returnVal = null;
            _promote();
        })

        btnsDiv.appendChild(submitBtn);
        btnsDiv.appendChild(cancelBtn);

        popDiv.appendChild(legend);
        popDiv.appendChild(form);
        document.body.appendChild(popDiv);

        return btnsDiv
    }

    async function createTask() {
        const btns = createCommon();
        form.className = "task";
        legend.textContent += "Task";

        const dateDiv = document.createElement("div");
        const dateLabel = document.createElement("label");
        const date = document.createElement("input");

        dateDiv.className = "date-div";
        dateLabel.setAttribute("for", "date");
        dateLabel.textContent = "Date: "
        date.id = "date";
        date.name = "date";
        date.type = "datetime-local";

        dateDiv.appendChild(date)
        form.appendChild(dateLabel);
        form.appendChild(dateDiv);

        const priorities = document.createElement("div");
        priorities.className = "priorities";
        for (let n of ["urgent", "important", "mild"]) {
            const priorityDiv = document.createElement("div");
            const label = document.createElement("label");
            const input = document.createElement("input");

            priorityDiv.className = "priority";
            label.textContent = n.charAt(0).toLocaleUpperCase() + n.slice(1);
            label.setAttribute("for", n);
            input.id = n;
            input.value = n;
            input.name = "priority";
            input.type = "radio"
            if (n == "important") {
                input.checked = true;
            }

            priorityDiv.appendChild(input);
            priorityDiv.appendChild(label);
            priorities.appendChild(priorityDiv);
        }
        form.appendChild(priorities);
        form.appendChild(btns);
        let type1;
        let promise = new Promise((resolve) => { _promote = resolve });
        await promise.then((result) => { type1 = result });
        return returnVal
    }

    async function createProject() {
        const btns = createCommon();
        form.appendChild(btns);
        form.className = "task";
        legend.textContent += "Task";

        let type1;
        let promise = new Promise((resolve) => { _promote = resolve });
        await promise.then((result) => { type1 = result });
        return returnVal
    }
    return { createTask, createProject }
})()

export class Listing {
    constructor(title) {
        this.title = title;
    }
    project() {
        document.querySelector(".projects-lst").textContent = "";
        const main = document.createElement("div");
        const titleEle = document.createElement("h1");
        const list = document.createElement("div");

        titleEle.textContent = this.title;
        main.appendChild(titleEle);
        main.appendChild(list);
        document.querySelector(".projects-lst").appendChild(main)
        list.className = "project-list"
        return list
    }
    task() {
        document.querySelector(".tasks-lst").textContent = "";
        const main = document.createElement("div");
        const titleEle = document.createElement("h1");
        const list = document.createElement("div");

        titleEle.textContent = this.title;
        main.appendChild(titleEle);
        main.appendChild(list);
        document.querySelector(".tasks-lst").appendChild(main)
        list.className = "task-list"
        return list
    }
}