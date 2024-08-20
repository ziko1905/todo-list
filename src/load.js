import { format } from "date-fns";
import PubSub from "pubsub-js";
import { projectList } from ".";
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
        this.title = document.createElement("h2");
        const desc = document.createElement("p");
        
        this.title.textContent = this.obj.title;
        desc.textContent = this.obj.description;
        this.editBtn.textContent = "Edit";
        this.editBtn.className = "edit-btn"

        this.div.appendChild(this.title);
        this.div.appendChild(desc);
        this.div.appendChild(this.editBtn);
    }

    edit() {
        this.div.textContent = "";
        this.editForm = document.createElement("form");
        this.titleInput = document.createElement("input");
        const descInput = document.createElement("textarea");
        const buttonsDiv = document.createElement("div");
        const submitBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        this.titleInput.setAttribute("placeholder", this.obj.title);
        this.titleInput.name = "title"
        descInput.className = "desc";
        descInput.setAttribute("placeholder", this.obj.description);
        descInput.name = "description";
        buttonsDiv.className = "form-btns";
        submitBtn.textContent = "Ok";
        cancelBtn.textContent = "Cancel";
        submitBtn.className = "submit-btn";
        cancelBtn.className = "cancel-btn"

        submitBtn.addEventListener("click", (e) => {
            e.preventDefault()
            if (this.editForm.reportValidity()) {
                this.div.remove()
                this.obj.edit(new FormData(this.editForm))
            }
            
        })

        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault()
            this.div.remove()
            this.obj.edit(null);
        }
        )
        
        buttonsDiv.appendChild(submitBtn);
        buttonsDiv.appendChild(cancelBtn);
        this.editForm.appendChild(this.titleInput);
        this.editForm.appendChild(descInput);
        this.editForm.appendChild(buttonsDiv);
        this.div.appendChild(this.editForm);
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
        this.createSmallerCard()
    }
    editProjectCard() {
        super.edit()
    }
    createSmallerCard() {
        this.smallerCard = this.div.cloneNode(true);
        const smallerEditBtn = this.smallerCard.querySelector("button");
        smallerEditBtn.remove();
    }

    getSmallerCard() {
        return this.smallerCard
    }
}

export class TaskCard extends Card {
    constructor(task, listingFunct) {
        super(task, listingFunct)
        this.div.className = "task-card"
        this.createTaskSpecific();
        this.editBtn.addEventListener("click", () => this.editTaskCard())
    }
    editTaskCard() {
        super.edit();
        const editHeader = document.createElement("div");
        const dueDate = document.createElement("input");
        const everyDayDiv = document.createElement("div");
        const everyDayInput = document.createElement("input");
        const everyDayLabel = document.createElement("label");
        const priorities = document.createElement("div");

        dueDate.name = "date";
        dueDate.type = "datetime-local";
        dueDate.value = this.obj.date;
        everyDayDiv.className = "every-day";
        everyDayInput.className = "every-day";
        everyDayInput.type = "checkbox";
        everyDayInput.id = "every-day";
        everyDayInput.name = "every-day";
        everyDayInput.value = true;
        everyDayLabel.className = "every-day";
        everyDayLabel.textContent = "Every Day";
        everyDayLabel.setAttribute("for", "every-day");

        priorities.className = "priorities";
        for (let n of ["urgent", "important", "mild"]) {
            const priorityDiv = document.createElement("div");
            const input = document.createElement("input");
            const label = document.createElement("label");

            priorityDiv.className = "priority"
            input.name = "priority";
            input.id = n;
            input.value = n;
            input.type = "radio";
            label.textContent = n;
            label.setAttribute("for", n)
            if (this.div.classList.contains(n)) input.checked = true

            priorityDiv.appendChild(input);
            priorityDiv.appendChild(label);
            priorities.appendChild(priorityDiv);
        }

        everyDayDiv.appendChild(everyDayInput);
        everyDayDiv.appendChild(everyDayLabel);
        editHeader.className = "edit-header";
        editHeader.appendChild(this.titleInput);
        editHeader.appendChild(dueDate);
        editHeader.appendChild(everyDayDiv);
        editHeader.appendChild(priorities);
        this.editForm.insertBefore(editHeader, this.editForm.firstChild);

    }

    createTaskSpecific() {
        const header = document.createElement('div');
        const dueDate = document.createElement("p");

        header.className = "header";
        dueDate.className = "due-date";
        dueDate.textContent = "Due date: ";
        this.div.classList.add(this.obj.priority)
        if (this.obj.date == "E") dueDate.textContent += "Today";
        else dueDate.textContent += format(new Date(this.obj.date), "hh:mm dd.mm.yy");

        header.appendChild(dueDate);
        header.appendChild(this.title);
        this.div.insertBefore(header, this.div.firstChild);
        this.div.setAttribute("data-projectName", this.obj.project.title ? `#${this.obj.project.title}` : "");
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

        const projectsDiv = document.createElement("div");
        const dateDiv = document.createElement("div");
        const dateLabel = document.createElement("label");
        const date = document.createElement("input");

        projectsDiv.className = "projects-lst";
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

        for (let n = 0; n < projectList.length; n++) {
            const label = document.createElement("label");
            const input = document.createElement("input");

            label.setAttribute("for", n);
            input.id = n;
            input.type = "radio";
            input.name = "project";
            input.value = n;
            label.appendChild(projectList[n].card.getSmallerCard())
            projectsDiv.appendChild(input);
            projectsDiv.appendChild(label);
        }
        form.appendChild(priorities);
        form.appendChild(btns);
        form.appendChild(projectsDiv);
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