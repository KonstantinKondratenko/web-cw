(() => {
    let  table  = JSON.parse(localStorage.getItem("records_table"))
    table.sort((a, b) => b.score - a.score)
    if (table.length  > 5)
    {
        table.pop()
    }
    // table = table.slice(table.length - 5)

    document.getElementById("records_table").innerHTML = `<ul> 
                ${  table.map((record) => `<li>${record.name} : ${record.score} очков</li>`).join("")}
            </ul>`
    })()