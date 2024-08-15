export function createNav() {
    const nav = document.querySelector("nav");
    let cards = [];
    for (let n of ["Project"]) {
        const card = document.createElement("div")
        card.className = "card";
        card.textContent = n;
        cards.push(card);
        nav.appendChild(card);
    }
}
