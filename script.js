// ========================================
// ✅ Supabase Configuration (Kept in script.js because .env is NOT supported)
const SUPABASE_URL = "https://svagsjxegdinhmtomkhd.supabase.co";  // 🔒 Keep secure with RLS
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YWdzanhlZ2RpbmhtdG9ta2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjE5MzYsImV4cCI6MjA1NTgzNzkzNn0.x1piuc-8g2k6c71HbnjVY9djVCfqg-Y5FxcOAFuoO5g";  // 🔒 Safe to use publicly with RLS enabled

// ✅ Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("Supabase initialized:", supabaseClient);

// ========================================
// ✅ Function to Add a Match
// ========================================
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

// ========================================
// 📥 Load Matches from Supabase
// ========================================
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
                <td class="actions">
                    <button class="edit-btn" onclick="editMatch(${match.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteMatch(${match.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// ========================================
// ✏️ Edit an Existing Match
// ========================================
async function editMatch(id) {
    console.log(`Editing match: ${id}`);

    // Fetch match details
    const { data: match, error } = await supabaseClient.from("matches").select("*").eq("id", id).single();
    
    if (error) {
        console.error("Error fetching match:", error.message);
        alert("Error retrieving match details.");
        return;
    }

    if (!match) {
        console.error("Match not found.");
        alert("Match not found.");
        return;
    }

    console.log("Match Data Retrieved:", match);

    // Ensure form fields exist before setting values
    if (!document.getElementById("match-date")) {
        console.warn("Match form fields not found. Are you on the correct page?");
        return;
    }

    document.getElementById("match-date").value = match.date || "";
    document.getElementById("opponent").value = match.opponent || "";
    document.getElementById("home-away").value = match.home_away || "Home";
    document.getElementById("score-us").value = match.score_us || "";
    document.getElementById("score-them").value = match.score_them || "";
    document.getElementById("match-type").value = match.type || "League";
    document.getElementById("notes").value = match.notes || "";
}

// ========================================
// ✏️ Update an Existing Match
// ========================================
async function updateMatch(event, id) {
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

    const { data, error } = await supabaseClient.from("matches").update(updatedMatchData).eq("id", id);

    if (error) {
        console.error("Error updating match:", error.message);
        alert("Failed to update match.");
    } else {
        console.log("Match updated successfully:", data);
        alert("Match updated successfully!");
        loadMatches(); // Refresh match list
    }
}

// ========================================
// ❌ Delete a Match from Supabase
// ========================================
async function deleteMatch(id) {
    const { data, error } = await supabaseClient.from("matches").delete().eq("id", id);

    if (error) {
        console.error("Error deleting match:", error.message);
        alert("Failed to delete match.");
    } else {
        console.log("Match deleted successfully:", data);
        alert("Match deleted successfully!");
        loadMatches(); // Refresh match list
    }
}

// ========================================
// ⚡ Initial Setup on Page Load
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded!");

    const matchForm = document.getElementById("match-form");
    if (matchForm) {
        matchForm.addEventListener("submit", addMatch);
    } else {
        console.warn("Match form not found on this page, skipping event listener.");
    }

    loadMatches();
});
