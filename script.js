document.addEventListener('DOMContentLoaded', () => {
    const startStopBtn = document.getElementById('startStopBtn');
    const dlText = document.getElementById('dlText');
    const ulText = document.getElementById('ulText');
    const pingText = document.getElementById('pingText');
    const jitText = document.getElementById('jitText');
    const speedMessage = document.getElementById('speedMessage');
    const ipArea = document.getElementById('ipArea');

    const testServer = {
        dlURL: 'https://librespeed.org/random4000x4000.jpg',
        ulURL: 'https://librespeed.org/upload.php',
        pingURL: 'https://librespeed.org/ping.php'
    };

    let speedtest;

    startStopBtn.addEventListener('click', () => {
        if (startStopBtn.classList.contains('running')) {
            speedtest.abort();
        } else {
            startStopBtn.classList.add('running');
            startStopBtn.textContent = 'Abort';
            startSpeedTest();
        }
    });

    function startSpeedTest() {
        speedtest = new Speedtest({
            url_dl: testServer.dlURL,
            url_ul: testServer.ulURL,
            url_ping: testServer.pingURL
        });

        speedtest.onupdate = (data) => {
            dlText.textContent = data.dlStatus || '0.00';
            ulText.textContent = data.ulStatus || '0.00';
            pingText.textContent = data.pingStatus || '0';
            jitText.textContent = data.jitterStatus || '0';
            ipArea.textContent = `IP Address: ${data.clientIp}`;
        };

        speedtest.onend = (aborted) => {
            startStopBtn.classList.remove('running');
            startStopBtn.textContent = 'Start';

            if (aborted) {
                resetTest();
            } else {
                const dlSpeed = parseFloat(dlText.textContent);
                if (dlSpeed > 50) {
                    speedMessage.textContent = '📽️👍';
                } else {
                    speedMessage.textContent = '🙄';
                }
            }
        };

        speedtest.start();
    }

    function resetTest() {
        dlText.textContent = '0.00';
        ulText.textContent = '0.00';
        pingText.textContent = '0';
        jitText.textContent = '0';
        speedMessage.textContent = '';
    }
});
