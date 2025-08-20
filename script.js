// Global averages (rough estimates)
const GLOBAL_AVERAGES = {
  ping: 40,
  download: 80,
  upload: 30
};

function rankSpeed(ping, download, upload) {
  let score = 0;
  if (ping <= GLOBAL_AVERAGES.ping) score++;
  if (download >= GLOBAL_AVERAGES.download) score++;
  if (upload >= GLOBAL_AVERAGES.upload) score++;

  if (score === 3) return "Above Average";
  if (score === 2) return "Average";
  return "Below Average";
}

document.getElementById("start-btn").addEventListener("click", () => {
  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.remove("hidden");

  document.getElementById("ping").innerText = "Testing...";
  document.getElementById("download").innerText = "";
  document.getElementById("upload").innerText = "";
  document.getElementById("rank").innerText = "";

  const st = new Speedtest();

  st.onupdate = data => {
    if (data.ping !== undefined) document.getElementById("ping").innerText = data.ping.toFixed(2);
    if (data.download !== undefined) document.getElementById("download").innerText = data.download.toFixed(2);
    if (data.upload !== undefined) document.getElementById("upload").innerText = data.upload.toFixed(2);
  };

  st.onend = data => {
    const rank = rankSpeed(data.ping, data.download, data.upload);
    document.getElementById("rank").innerText = rank;
  };

  st.start();
});
