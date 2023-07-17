import querySelectorAsync from "../utility/querySelectorAsync";
import { waitForAllElements } from "../utility/waitForElement";

export async function formatPrefTable() {
    const table = await querySelectorAsync("table.preftable");
    const prefDiv = document.createElement("div");
    table.before(prefDiv);

    waitForAllElements("table.preftable > tbody > tr", function (row) {
        const newRow = document.createElement("div");
        newRow.classList.add("pref-row");

        const tableHeader = row.querySelector("th");
        const header = document.createElement("h1");
        if (tableHeader) {
            header.innerHTML = tableHeader.innerHTML;
        }
        newRow.appendChild(header);

        const tableData = row.querySelector("td");
        const data = document.createElement("div");
        if (tableData) {
            data.innerHTML = tableData.innerHTML;
        }
        newRow.appendChild(data);

        row.remove();
        prefDiv.appendChild(newRow);
    });
}

formatPrefTable();
