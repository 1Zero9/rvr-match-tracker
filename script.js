// ✅ Supabase Configuration (Kept in script.js because .env is NOT supported)
const SUPABASE_URL = "https://svagsjxegdinhmtomkhd.supabase.co";  // 🔒 Keep secure with RLS
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YWdzanhlZ2RpbmhtdG9ta2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjE5MzYsImV4cCI6MjA1NTgzNzkzNn0.x1piuc-8g2k6c71HbnjVY9djVCfqg-Y5FxcOAFuoO5g";  // 🔒 Safe to use publicly with RLS enabled

// ✅ Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase initialized:", supabaseClient);

// ✅ Function to Add a Match
async function addMatch(event) {
    event.preventDefault(); // Prevent page reload

    const matchData = {
        date: document.getElementById("match-date").value,
        opponent: document.getElementById("opponent").value,
        home_away: document.getElementById("home-away").value,
        score_us: parseInt(document.getElementById("score-us").value),
        score_them: parseInt(document.getElementById("score-them").value),
        type: document.getElementById("match-type").value,
        notes: document.getElementById("notes").value
    };

    // ✅ Save to localStorage (so it's not lost on refresh)
    localStorage.setItem("lastMatch", JSON.stringify(matchData));

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
    if (tableBody) {
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
}

// ✅ Restore Last Match Data from localStorage
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded!");

    // ✅ Attach event listener to match form
    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    } else {
        console.error("Match form not found!");
    }

    // ✅ Load matches when the page loads
    loadMatches();

    // ✅ Restore saved form data from localStorage
    const savedMatch = localStorage.getItem("lastMatch");
    if (savedMatch) {
        const match = JSON.parse(savedMatch);
        document.getElementById("match-date").value = match.date || "";
        document.getElementById("opponent").value = match.opponent || "";
        document.getElementById("home-away").value = match.home_away || "Home";
        document.getElementById("score-us").value = match.score_us || "";
        document.getElementById("score-them").value = match.score_them || "";
        document.getElementById("match-type").value = match.type || "League";
        document.getElementById("notes").value = match.notes || "";
    }

    // ✅ Display version number & auto-increment for updates
    const versionElement = document.getElementById("version-number");
    const versionDateElement = document.getElementById("version-date");
    let version = localStorage.getItem("version") || "1.0.0";
    if (versionElement) {
        versionElement.textContent = version;
    } else {
        console.error("Version element not found!");
    }

    // Display current date and time for the version
    if (versionDateElement) {
        const now = new Date();
        versionDateElement.textContent = now.toLocaleString();
    } else {
        console.error("Version date element not found!");
    }

    // Increment version (for next update)
    const [major, minor, patch] = version.split('.').map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;
    localStorage.setItem("version", newVersion);
});
