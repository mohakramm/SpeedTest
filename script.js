// Global averages for ranking
const GLOBAL_AVERAGES = { ping: 40, download: 80, upload: 30 };

function rankSpeed(ping, download, upload) {
    let score = 0;
    if (ping <= GLOBAL_AVERAGES.ping) score++;
    if (download >= GLOBAL_AVERAGES.download) score++;
    if (upload >= GLOBAL_AVERAGES.upload) score++;

    if (score === 3) return { text: "Above Average", color: "#28a745" }; // green
    if (score === 2) return { text: "Average", color: "#ffc107" };       // yellow
    return { text: "Below Average", color: "#dc3545" };                  // red
}

// Initialize UI elements
function I(id) { return document.getElementById(id); }

function initUI() {
    ["dlText", "ulText", "pingText", "jitText", "ip", "speedMessage"].forEach(id => {
        I(id).textContent = "";
    });
    ["dlBar", "ulBar"].forEach(id => {
        I(id).style.width = "0%";
    });
}

// Create progress bars dynamically
window.onload = function(){
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
    startStop();
};

// Setup LibreSpeed
var s = new Speedtest();
s.setParameter("telemetry_level","basic");

s.onupdate = function(data){
    I("ip").textContent = data.clientIp;
    I("dlText").textContent = (data.testState==1&&data.dlStatus==0)?"...":data.dlStatus;
    I("ulText").textContent = (data.testState==3&&data.ulStatus==0)?"...":data.ulStatus;
    I("pingText").textContent = data.pingStatus;
    I("jitText").textContent = data.jitterStatus;

    // Update progress bars (max 200 Mbps for example scaling)
    const maxSpeed = 200;
    if(data.dlStatus) I("dlBar").style.width = Math.min(data.dlStatus/maxSpeed*100,100) + "%";
    if(data.ulStatus) I("ulBar").style.width = Math.min(data.ulStatus/maxSpeed*100,100) + "%";
};

s.onend = function(aborted){
    I("startStopBtn").className="";
    if(aborted){
        initUI();
    } else {
        let ping = parseFloat(I("pingText").textContent);
        let dl = parseFloat(I("dlText").textContent);
        let ul = parseFloat(I("ulText").textContent);
        const result = rankSpeed(ping, dl, ul);
        I("speedMessage").textContent = result.text;
        I("speedMessage").style.color = result.color;
    }
};

function startStop(){
    if(s.getState()==3){
        s.abort();
    } else {
        s.start();
        I("startStopBtn").className="running";
    }
}
