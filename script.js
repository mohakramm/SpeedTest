// Global averages for ranking (you can adjust)
const GLOBAL_AVERAGES = { ping: 40, download: 80, upload: 30 };

// Rank function
function rankSpeed(ping, download, upload) {
    let score = 0;
    if(ping <= GLOBAL_AVERAGES.ping) score++;
    if(download >= GLOBAL_AVERAGES.download) score++;
    if(upload >= GLOBAL_AVERAGES.upload) score++;

    if(score === 3) return { text: "Above Average", color: "#28a745" };
    if(score === 2) return { text: "Average", color: "#ffc107" };
    return { text: "Below Average", color: "#dc3545" };
}

// Shortcut for getElementById
function I(id) { return document.getElementById(id); }

// Initialize UI
function initUI() {
    ["dlText", "ulText", "pingText", "jitText", "ip", "speedMessage"].forEach(id => I(id).textContent = id.includes("Text") ? "0.00" : "");
    ["dlBar","ulBar"].forEach(id => I(id).style.width = "0%");
}

// Create progress bars dynamically if missing
window.onload = function() {
    ["dlText","ulText"].forEach(id=>{
        const container = document.createElement("div");
        container.className = "progress-container";
        const bar = document.createElement("div");
        bar.className = "progress-bar";
        bar.id = id==="dlText"?"dlBar":"ulBar";
        container.appendChild(bar);
        I(id).parentNode.appendChild(container);
    });
    initUI();
};

// Initialize LibreSpeed
var s = new Speedtest();
s.setParameter("telemetry_level","basic");

// Update callback
s.onupdate = function(data){
    I("ip").textContent = data.clientIp || "";
    I("dlText").textContent = data.dlStatus ? data.dlStatus.toFixed(2) : "...";
    I("ulText").textContent = data.ulStatus ? data.ulStatus.toFixed(2) : "...";
    I("pingText").textContent = data.pingStatus || "...";
    I("jitText").textContent = data.jitterStatus || "...";

    const maxSpeed = 200;
    if(data.dlStatus) I("dlBar").style.width = Math.min(data.dlStatus/maxSpeed*100,100)+"%";
    if(data.ulStatus) I("ulBar").style.width = Math.min(data.ulStatus/maxSpeed*100,100)+"%";
};

// End callback
s.onend = function(aborted){
    I("startStopBtn").className = "";
    if(aborted){
        initUI();
    } else {
        const ping = parseFloat(I("pingText").textContent);
        const dl = parseFloat(I("dlText").textContent);
        const ul = parseFloat(I("ulText").textContent);
        const result = rankSpeed(ping, dl, ul);
        I("speedMessage").textContent = result.text;
        I("speedMessage").style.color = result.color;
    }
};

// Start/Stop button
function startStop() {
    if(s.getState() === 3){
        s.abort();
    } else {
        s.start();
        I("startStopBtn").className = "running";
    }
}
