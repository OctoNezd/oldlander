import querySelectorAsync from "./utility/querySelectorAsync";

export async function formatPrefTable() {
    const table = await querySelectorAsync("table.preftable");

    const tableParent = table.parentNode;
    const prefDiv = document.createElement("div");
    tableParent.replaceChild(prefDiv, table);
    const tbody = table.firstChild;
    for (const row of tbody.childNodes) {
        const newRow = document.createElement("div");
        newRow.setAttribute("class", "pref-row");
        prefDiv.appendChild(newRow);

        const header = document.createElement("h1");
        header.innerText = row.firstChild.innerText;
        newRow.appendChild(header);

        const prefright = row.lastChild;
        newRow.appendChild(prefright);
    }
}

formatPrefTable();
