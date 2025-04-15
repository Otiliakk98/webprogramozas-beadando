document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("dataTable");
    const ctx = document.getElementById("myChart").getContext("2d");
    let myChart = null;

    table.addEventListener("click", function (event) {
        const row = event.target.closest("tr");
        if (!row || row.parentNode.tagName === "THEAD") return;

        // Kijelölés kezelése
        document.querySelectorAll("tr.selected").forEach(tr => tr.classList.remove("selected"));
        row.classList.add("selected");

        // Adatok kinyerése
        const data = [...row.children].map(td => Number(td.textContent));

        // Régi diagram törlése
        if (myChart) myChart.destroy();

        // Új diagram létrehozása
        myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["1. oszlop", "2. oszlop", "3. oszlop", "4. oszlop", "5. oszlop"],
                datasets: [{
                    label: "Kiválasztott sor adatai:",
                    data: data,
                    borderColor: "#4dc9f5",
                    borderWidth: 2,
                    fill: false,
                    pointStyle: 'circle'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'A táblázat adatainak vizualizációja:'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 0 // Animáció kikapcsolása
                }
            }
        });
    });
});