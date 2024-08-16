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
    const popDiv = document.createElement("div")
    const form = document.createElement("form");
    const titleLabel = document.createElement("label");
    const titleInput = document.createElement("input");
    const description = document.createElement("textarea");

    popDiv.className = "pop";
    titleLabel.textContent = "Name: "; 
    titleLabel.setAttribute("for", "title");
    titleLabel.className = "title-lab";
    titleInput.id = "title";
    titleInput.setAttribute("name", "title");
    titleInput.className = "title-inp";
    description.className = "desc";

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(description);


    if (type = "task") {
        form.className = "task";
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
        form.popDiv.className = "project";
    }

    popDiv.appendChild(form)
    document.body.appendChild(popDiv)
}