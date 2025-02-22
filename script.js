// ✅ Supabase Configuration (Replace with Your Actual Supabase Credentials)
const SUPABASE_URL = "https://iuncufxtierapkvvhswc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmN1Znh0aWVyYXBrdnZoc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTA5NTgsImV4cCI6MjA1NTgyNjk1OH0.FIYbqYVwWjfrxBJ5YfEGe-xKpjwkziX5n3Ha7IX6zVI";

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
