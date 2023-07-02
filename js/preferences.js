export function formatPrefTable() {
    const table = document.querySelector("table.preftable");
    if (!table) {
        return;
    }
    console.log("Test message from pref 1");
    const tableParent = table.parentNode;
    const prefDiv = document.createElement("div");
    tableParent.appendChild(prefDiv);
    tableParent.removeChild(table);
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