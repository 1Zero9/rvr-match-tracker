// ✅ Supabase Configuration (Replace with Your Actual Supabase Credentials)
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// ✅ Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase initialized:", supabaseClient);

// ✅ Function to Add a Match
async function addMatch(event) {
    event.preventDefault(); // Prevent form reload

    const matchData = {
        date: document.getElementById("match-date").value,
        opponent: document.getElementById("opponent").value,
        home_away: document.getElementById("home-away").value,
        score_us: parseInt(document.getElementById("score-us").value),
        score_them: parseInt(document.getElementById("score-them").value),
        type: document.getElementById("match-type").value,
        notes: document.getElementById("notes").value
    };

    console.log("Submitting match data:", matchData);

    const { data, error } = await supabaseClient.from("matches").insert([matchData]);

    if (error) {
        console.error("Error adding match:", error.message);
        alert("Failed to add match.");
    } else {
        console.log("Match added successfully:", data);
        alert("Match added successfully!");
        loadMatches(); // Refresh match list
    }
}

// ✅ Function to Load Matches from Supabase
async function loadMatches() {
    const { data, error } = await supabaseClient
        .from("matches")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error("Error loading matches:", error.message);
        return;
    }

    console.log("Matches loaded:", data);

    const tableBody = document.querySelector("#matches-table tbody");
    tableBody.innerHTML = "";

    data.forEach(match => {
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
}

// ✅ Run this code only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded!");

    // ✅ Ensure Supabase is initialized before using it
    if (!supabaseClient) {
        console.error("Supabase is not initialized!");
        return;
    }

    // ✅ Set up event listener for match form
    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    } else {
        console.error("Match form not found!");
    }

    // ✅ Load matches when the page loads
    loadMatches();

    // ✅ Display version number
    const VERSION_NUMBER = "1.0.0";
    const versionElement = document.getElementById("version-number");
    if (versionElement) {
        versionElement.textContent = VERSION_NUMBER;
    } else {
        console.error("Version element not found!");
    }
});
