import PubSub from "pubsub-js";
const content = document.querySelector(".content")

export function createNav() {
    const nav = document.querySelector("nav");
    let cards = [];
    for (let n of ["Projects", "Today", "By Importance", "By Date"]) {
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
        mainDiv.remove()
        mainDiv = document.createElement("div");
        addBtn = addBtn.cloneNode(true);
        removeBtn = removeBtn.cloneNode(true);
        const btnsDiv = document.createElement("div");

        btnsDiv.className = "btns-div";
        btnsDiv.appendChild(addBtn);
        btnsDiv.appendChild(removeBtn);
        mainDiv.appendChild(btnsDiv);
        mainDiv.appendChild(listingDiv);

        content.appendChild(mainDiv)
    }

    function createProjectsLayout() {
        createCommonLayout()
        addBtn.textContent = "New Project";
        removeBtn.textContent = "Remove Project";
        listingDiv.className = "projects-lst";
    }

    function createTasksLayout(newFunct, removeFunct) {
        createCommonLayout(newFunct, removeFunct)
        addBtn.textContent = "New Task";
        removeBtn.textContent = "Remove Task";
        listingDiv.className = "tasks-lst";
    }
    return { createProjectsLayout, createTasksLayout }
})()

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
            popDiv.remove()
            returnVal = new FormData(form);
            _promote();
        })

        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault()
            popDiv.remove()
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

        const dateLabel = document.createElement("label");
        const date = document.createElement("input");

        dateLabel.setAttribute("for", "date");
        dateLabel.textContent = "Date: "
        date.id = "date";
        date.name = "date";
        date.type = "datetime-local";

        form.appendChild(dateLabel);
        form.appendChild(date);

        const priorities = document.createElement("div");
        priorities.className = "priorities";
        for (let n of ["urgent", "important", "mild"]) {
            const priorityDiv = document.createElement("div");
            const label = document.createElement("label");
            const input = document.createElement("input");

            priorityDiv.className = "priority";
            priorityDiv.id = n;
            label.textContent = n.charAt(0).toLocaleUpperCase() + n.slice(1);
            label.setAttribute("for", n);
            input.id = n;
            input.value = n;
            input.name = "priority";
            input.type = "radio"

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