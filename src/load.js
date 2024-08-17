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

export const Layout = (function () {
    const content = document.querySelector(".content")
    const addBtn = document.createElement("button")
    const removeBtn = document.createElement("button");
    // Initializing mainDiv to dummy div to make creation code simpler
    let mainDiv = document.createElement("div");

    function createCommonLayout() {
        mainDiv.remove()
        mainDiv = document.createElement("div");
        const btnsDiv = document.createElement("div");
        const listingDiv = document.createElement("div");

        mainDiv.appendChild(btnsDiv);
        mainDiv.appendChild(listingDiv);

        content.appendChild(mainDiv)
    }

}

export const PopUp = (function () {
    let form;
    let _promote;
    async function createCommon(type) {
        let returnVal;

        form = document.createElement("form");
        const popDiv = document.createElement("div");
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
            legend.textContent += "Task";
            taskPopUp()
        }
        else {
            form.className = "project";
            legend.textContent += "Project";
        }

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
            _promote(type1);
        })

        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault()
            popDiv.remove()
            _promote(type1);
        })

        btnsDiv.appendChild(submitBtn);
        btnsDiv.appendChild(cancelBtn);
        form.append(btnsDiv);

        popDiv.appendChild(legend);
        popDiv.appendChild(form);
        document.body.appendChild(popDiv);

        let type1;
        let promise = new Promise((resolve) => { _promote = resolve });
        await promise.then((result) => { type1 = result });
        return returnVal
    }

    function taskPopUp() {
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
    }
    return { createCommon }
})()