const content = document.querySelector(".content")

export function createNav() {
    const nav = document.querySelector("nav");
    let cards = [];
    for (let n of ["Projects", "Today", "ByImportance", "ByDate"]) {
        const card = document.createElement("div")
        card.className = "card";
        card.textContent = n;
        cards.push(card);
        nav.appendChild(card);
    }
}

export function popUp(type) {
    const popDiv = document.createElement("div");
    const form = document.createElement("form");
    const legend = document.createElement("legend");
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


    if (type == "task") {
        form.className = "task";
        const dateLabel = document.createElement("label");
        const date = document.createElement("input");

        legend.textContent += "Task";
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
    }
    else {
        form.className = "project";
        legend.textContent += "Project";
    }

    popDiv.appendChild(legend);
    popDiv.appendChild(form);
    document.body.appendChild(popDiv);
}