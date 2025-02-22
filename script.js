// 🌐 Google Apps Script Web App URL with a CORS Proxy
const API_URL = "https://script.google.com/macros/s/AKfycbxSuSpbvTQ-TJKCo1dH2iTBoOFD-yenTQO4xMx7WWTH2oQ93NI53DiCCm4u0p0Kc57YyQ/exec"
// 🎯 Fetch and Display Matches
async function loadMatches() {
    try {
        const response = await fetch(API_URL);
        const matches = await response.json();

        if (!Array.isArray(matches)) {
            console.error("Invalid API response:", matches);
            return;
        }

        const tableBody = document.querySelector("#matches-table tbody");
        tableBody.innerHTML = "";
        
        matches.forEach(match => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${match.date}</td>
                <td>${match.opponent}</td>
                <td>${match.home_away}</td>
                <td>${match.score_us} - ${match.score_them}</td>
                <td>${match.type}</td>
                <td>${match.notes || "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading matches:", error);
    }
}

// ⚽ Add Match via Form
document.getElementById("match-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newMatch = {
        date: document.getElementById("match-date").value,
        opponent: document.getElementById("opponent").value,
        home_away: document.getElementById("home-away").value,
        score_us: parseInt(document.getElementById("score-us").value),
        score_them: parseInt(document.getElementById("score-them").value),
        type: document.getElementById("match-type").value,
        notes: document.getElementById("notes").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMatch)
        });

        const result = await response.json();
        if (result.success) {
            alert("Match added successfully!");
            loadMatches();
        } else {
            alert("Failed to add match.");
        }
    } catch (error) {
        console.error("Error adding match:", error);
    }
});

// 🚀 Load matches when page loads
loadMatches();
