// 🔹 Ensure Supabase is loaded first
document.addEventListener("DOMContentLoaded", () => {
    // 🔹 Load the Supabase client library
    if (typeof supabase === "undefined") {
        console.error("Supabase library not found. Ensure the script is loaded correctly.");
        return;
    }


// 🔹 Replace these with your actual Supabase credentials
const SUPABASE_URL = "https://iuncufxtierapkvvhswc.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bmN1Znh0aWVyYXBrdnZoc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTA5NTgsImV4cCI6MjA1NTgyNjk1OH0.FIYbqYVwWjfrxBJ5YfEGe-xKpjwkziX5n3Ha7IX6zVI";

// ✅ Initialize Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ✅ Load matches after Supabase is ready
    loadMatches();
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

    console.log("Submitting match data:", matchData); // Debugging log

    const { data, error } = await supabase.from("matches").insert([matchData]);

    if (error) {
        console.error("Error adding match:", error.message);
        alert("Failed to add match.");
    } else {
        console.log("Match added successfully:", data);
        alert("Match added successfully!");
        loadMatches(); // Refresh matches
    }
}

// Function to Load Matches
async function loadMatches() {
    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error("Error loading matches:", error.message);
        return;
    }

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


// ✅ Event Listeners
document.getElementById("match-form").addEventListener("submit", addMatch);

// ✅ Load matches on page load
loadMatches();


// ✅ Set the version number
const VERSION_NUMBER = "1.0.1"; // Update as needed

// ✅ Wait for the DOM to load before updating the version text
document.addEventListener("DOMContentLoaded", () => {
    const versionElement = document.getElementById("version-number");
    if (versionElement) {
        versionElement.textContent = VERSION_NUMBER;
    } else {
        console.error("Version element not found!");
    }
});
