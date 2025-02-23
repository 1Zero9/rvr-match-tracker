// ✅ Supabase Configuration
const SUPABASE_URL = "https://svagsjxegdinhmtomkhd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YWdzanhlZ2RpbmhtdG9ta2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjE5MzYsImV4cCI6MjA1NTgzNzkzNn0.x1piuc-8g2k6c71HbnjVY9djVCfqg-Y5FxcOAFuoO5g";

// ✅ Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase initialized:", supabaseClient);

// ✅ Function to Add a Match
async function addMatch(event) {
    event.preventDefault();

    const matchForm = document.getElementById("match-form");
    if (!matchForm) {
        console.error("Match form not found!");
        return;
    }

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
        loadMatches();
    }
}

// ✅ Function to Load Matches
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
    if (!tableBody) {
        console.warn("No match table found on this page.");
        return;
    }

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
            <td class="actions">
                <button class="edit-btn" onclick="editMatch(${match.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMatch(${match.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ✅ Function to Edit a Match
async function editMatch(id) {
    const { data: match, error } = await supabaseClient.from("matches").select("*").eq("id", id).single();
    if (error) {
        console.error("Error fetching match:", error.message);
        return;
    }

    if (!document.getElementById("match-date")) {
        console.warn("Match form fields not found. Ensure you're on the correct page.");
        return;
    }

    document.getElementById("match-date").value = match.date;
    document.getElementById("opponent").value = match.opponent;
    document.getElementById("home-away").value = match.home_away;
    document.getElementById("score-us").value = match.score_us;
    document.getElementById("score-them").value = match.score_them;
    document.getElementById("match-type").value = match.type;
    document.getElementById("notes").value = match.notes;

    const matchForm = document.getElementById("match-form");
    matchForm.removeEventListener("submit", addMatch);
    matchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedMatchData = {
            date: document.getElementById("match-date").value,
            opponent: document.getElementById("opponent").value,
            home_away: document.getElementById("home-away").value,
            score_us: parseInt(document.getElementById("score-us").value),
            score_them: parseInt(document.getElementById("score-them").value),
            type: document.getElementById("match-type").value,
            notes: document.getElementById("notes").value
        };

        const { error } = await supabaseClient.from("matches").update(updatedMatchData).eq("id", id);

        if (error) {
            console.error("Error updating match:", error.message);
            alert("Failed to update match.");
        } else {
            console.log("Match updated successfully.");
            alert("Match updated successfully!");
            loadMatches();
            matchForm.removeEventListener("submit", arguments.callee);
            matchForm.addEventListener("submit", addMatch);
        }
    });
}

// ✅ Function to Delete a Match
async function deleteMatch(id) {
    const { error } = await supabaseClient.from("matches").delete().eq("id", id);

    if (error) {
        console.error("Error deleting match:", error.message);
        alert("Failed to delete match.");
    } else {
        console.log("Match deleted successfully.");
        alert("Match deleted successfully!");
        loadMatches();
    }
}

// ✅ Restore Last Match Data from localStorage
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded!");

    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    } else {
        console.warn("Match form not found on this page.");
    }

    loadMatches();

    const savedMatch = localStorage.getItem("lastMatch");
    if (savedMatch) {
        const match = JSON.parse(savedMatch);
        if (document.getElementById("match-date")) {
            document.getElementById("match-date").value = match.date || "";
            document.getElementById("opponent").value = match.opponent || "";
            document.getElementById("home-away").value = match.home_away || "Home";
            document.getElementById("score-us").value = match.score_us || "";
            document.getElementById("score-them").value = match.score_them || "";
            document.getElementById("match-type").value = match.type || "League";
            document.getElementById("notes").value = match.notes || "";
        }
    }

    const versionElement = document.getElementById("version-number");
    const versionDateElement = document.getElementById("version-date");
    let version = localStorage.getItem("version") || "1.0.0";
    if (versionElement) {
        versionElement.textContent = version;
    } else {
        console.error("Version element not found!");
    }

    if (versionDateElement) {
        versionDateElement.textContent = new Date().toLocaleString();
    }

    const [major, minor, patch] = version.split('.').map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;
    localStorage.setItem("version", newVersion);
});
