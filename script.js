// ✅ Supabase Configuration (Replace with Your Actual Supabase Credentials)
const SUPABASE_URL = "https://svagsjxegdinhmtomkhd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YWdzanhlZ2RpbmhtdG9ta2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjE5MzYsImV4cCI6MjA1NTgzNzkzNn0.x1piuc-8g2k6c71HbnjVY9djVCfqg-Y5FxcOAFuoO5g"
// ✅ Ensure the script runs after the Supabase library is loaded
document.addEventListener("DOMContentLoaded", () => {
    if (typeof supabase === "undefined") {
        console.error("Supabase library not loaded! Ensure it's included in index.html.");
        return;
    }

    // ✅ Initialize Supabase Client
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialized:", window.supabaseClient);

    // ✅ Attach event listener to the form
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

    const { data, error } = await window.supabaseClient.from("matches").insert([matchData]);

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
    const { data, error } = await window.supabaseClient
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
