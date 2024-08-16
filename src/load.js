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
    popDiv.className = "pop";

    if (type = "task") {
        form.className = "task";
    }
    else {
        form.popDiv.className = "task";
    }

    document.body.appendChild(popDiv)
}