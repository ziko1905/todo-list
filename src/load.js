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
    }
    else {
        form.popDiv.className = "task";
    }

    popDiv.appendChild(form)
    document.body.appendChild(popDiv)
}