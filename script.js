document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.querySelector('.timer-display');
    const statusMessage = document.querySelector('.status-message');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const audioElement = document.getElementById('notification-sound');

    let timerInterval;
    let endTime;
    let isRunning = false;
    let audioContext = null;

    // 生成10-20秒之间的随机时间（毫秒）
    function generateRandomTime() {
        const minSeconds = 10;
        const maxSeconds = 20;
        const minMs = minSeconds * 1000;
        const maxMs = maxSeconds * 1000;
        return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    }

    // 格式化时间为MM:SS格式
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 创建并播放提示音
    function playNotificationSound() {
        // 在播放前再次检查并恢复AudioContext
        if (audioContext.state === 'suspended') {
            console.log('提示音播放前恢复AudioContext...');
            audioContext.resume().then(() => {
                console.log('提示音播放前AudioContext状态:', audioContext.state);
                createAndPlayOscillator();
            }).catch(err => {
                console.error('提示音播放前恢复AudioContext失败:', err);
                fallbackToVibration();
            });
        } else {
            createAndPlayOscillator();
        }

        function createAndPlayOscillator() {
            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                console.log('开始播放提示音...');
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(1.0, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 1.5);
                statusMessage.textContent = '正在播放提示音...';
            } catch (error) {
                console.error('提示音播放失败:', error);
                fallbackToVibration();
            }
        }

        function fallbackToVibration() {
            console.log('AudioContext状态:', audioContext.state);
            console.log('当前时间:', audioContext.currentTime);
            console.log('浏览器信息:', navigator.userAgent);
            statusMessage.textContent = '提示音播放失败，已尝试振动';
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
        }
    }

    function startTimer() {
        if (isRunning) return;

        // 在用户交互时创建AudioContext（解决浏览器 autoplay 限制）
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // 预播放无声音频以激活AudioContext
            const silentOsc = audioContext.createOscillator();
            const silentGain = audioContext.createGain();
            silentGain.gain.value = 0; // 设置增益为0使其无声
            silentOsc.connect(silentGain);
            silentGain.connect(audioContext.destination);
            silentOsc.start();
            silentOsc.stop(audioContext.currentTime + 0.01);
            console.log('已初始化无声音频以激活AudioContext');
        } else {
            console.log('AudioContext状态在播放前:', audioContext.state);
            if (audioContext.state === 'suspended') {
                console.log('尝试恢复AudioContext...');
                audioContext.resume().then(() => {
                    console.log('恢复后AudioContext状态:', audioContext.state);
                }).catch(err => {
                    console.error('恢复AudioContext失败:', err);
                });
            }
        }

        const duration = generateRandomTime();
        endTime = Date.now() + duration;
        isRunning = true;

        startBtn.disabled = true;
        resetBtn.disabled = false;
        statusMessage.textContent = '计时器运行中...';

        updateTimerDisplay();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }

    function updateTimerDisplay() {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '00:00';
            statusMessage.textContent = '时间到！';
            isRunning = false;
            playNotificationSound();
            startBtn.disabled = false;
            return;
        }

        timerDisplay.textContent = formatTime(remainingTime);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerDisplay.textContent = '--:--';
        statusMessage.textContent = '点击开始按钮开始计时';
        isRunning = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
    }

    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
});