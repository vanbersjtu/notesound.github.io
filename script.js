// 主DOM加载完成事件
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const statusMessage = document.querySelector('.status-message');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const audioElement = document.getElementById('notification-sound');

    let timerInterval;
    let endTime;
    let isRunning = false;
    let audioContext = null;

    // 生成3-5分钟之间的随机时间（毫秒）
    function generateRandomTime() {
    const minSeconds = 180; // 3分钟
    const maxSeconds = 300; // 5分钟
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
    // 使用HTML5 Audio元素播放优美音乐提示音
    const audioElement = document.getElementById('notification-sound');
    if (!audioElement) {
        console.error('音频元素未找到');
        fallbackToVibration();
        return;
    }

    // 检查音频元素是否已加载
    if (audioElement.readyState < 2) {
        console.log('音频尚未加载完成，等待加载...');
        audioElement.addEventListener('canplaythrough', playAudioOnce, { once: true });
        return;
    }

    playAudio();

    function playAudioOnce() {
        playAudio();
    }

    function playAudio() {
        try {
            // 检查是否正在播放，防止重复触发
            if (!audioElement.paused) {
                console.log('音频正在播放中，忽略重复播放请求');
                return;
            }
            console.log('=== 开始播放流程 ===');
            console.log('视频元素状态:', audioElement.readyState);
            console.log('视频URL:', audioElement.currentSrc);
            console.log('视频网络状态:', audioElement.networkState);
            console.log('视频错误状态:', audioElement.error);
            console.log('视频就绪状态:', audioElement.readyState);
            console.log('视频可播放时长:', audioElement.duration);
            console.log('视频暂停状态:', audioElement.paused);
            console.log('视频静音状态:', audioElement.muted);
            console.log('视频音量:', audioElement.volume);

            audioElement.currentTime = 0;
            statusMessage.textContent = '尝试播放视频...';

            audioElement.play().then(() => {
                statusMessage.textContent = '视频播放成功！';
                console.log('=== 视频播放成功 ===');
                console.log('当前播放位置:', audioElement.currentTime);
                console.log('播放速率:', audioElement.playbackRate);
            }).catch(error => {
                const errorMsg = `播放失败: ${error.name} - ${error.message}`;
                statusMessage.textContent = errorMsg;
                console.error('=== 视频播放失败 ===');
                console.error('错误名称:', error.name);
                console.error('错误消息:', error.message);
                console.error('错误堆栈:', error.stack);
                console.error('视频错误对象:', audioElement.error);
                fallbackToVibration();
            });
        } catch (error) {
            console.error('=== 播放过程发生异常 ===');
            console.error('错误类型:', error.name);
            console.error('错误消息:', error.message);
            console.error('错误堆栈:', error.stack);
            statusMessage.textContent = `播放异常: ${error.message}`;
            fallbackToVibration();
        }
    }

    function fallbackToVibration() {
        statusMessage.textContent = '提示音播放失败，已尝试振动';
        console.log('尝试振动 fallback');
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
    }
}

    function startTimer() {
    if (isRunning) return;

    // 重置计时器状态
    clearInterval(timerInterval);
    isRunning = true;
    startBtn.disabled = true;
    resetBtn.disabled = false;
    statusMessage.textContent = '计时器运行中...';

    // 设置视频元素预加载属性以解决自动播放限制
    if (audioElement) {
        audioElement.preload = 'auto';
        console.log('已设置视频预加载属性');
    }

    // 生成随机时间并启动计时器
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
        
        // 重置时停止视频播放
        const audioElement = document.getElementById('notification-sound');
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
            console.log('重置时已停止视频播放');
        }
    }

    // 初始化计时器（移除重复的DOMContentLoaded监听）
    function initTimer() {
    // 原有计时器代码保持不变
    const timerDisplay = document.getElementById('timer-display');
    const statusMessage = document.getElementById('status-message');
    const startBtn = document.getElementById('start-btn');
    const timerStartBtn = document.getElementById('timer-start-btn');
    const resetBtn = document.getElementById('timer-reset-btn');

    // 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-3');
        } else {
            navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
            navbar.classList.remove('py-3');
            navbar.classList.add('py-4');
        }
    });

    // 初始化动画元素
    initAnimations();

    // 初始化图表
    if (typeof echarts !== 'undefined') {
        initCharts();
    } else {
        console.warn('ECharts library not loaded');
    }

    // 统一的开始按钮事件处理
    startBtn.addEventListener('click', startTimer);
    timerStartBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
}

// 调用初始化函数
initTimer();
    
    // 初始化滚动动画
    function initAnimations() {
        // 获取所有需要动画的元素
        const animatedElements = document.querySelectorAll('[data-animate]');
    
        // 创建观察者
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.getAttribute('data-animate');
                    animateElement(entry.target, animationType);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
    
        // 观察所有动画元素
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // 元素动画函数
    function animateElement(element, type) {
        const duration = 1000;
        const delay = 100;
        const easing = 'easeOutQuart';
    
        switch(type) {
            case 'fade-up':
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: duration,
                    delay: delay,
                    easing: easing
                });
                break;
            case 'fade-right':
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateX: [-30, 0],
                    duration: duration,
                    delay: delay,
                    easing: easing
                });
                break;
            case 'fade-left':
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateX: [30, 0],
                    duration: duration,
                    delay: delay,
                    easing: easing
                });
                break;
            default:
                anime({
                    targets: element,
                    opacity: [0, 1],
                    duration: duration,
                    delay: delay,
                    easing: easing
                });
        }
    }
    
    // 初始化ECharts图表
    function initCharts() {
        // 使用频率统计图表
        const usageChart = echarts.init(document.getElementById('usage-chart'));
        const usageOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(87, 81, 213, 0.2)'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(22, 22, 21, 0.1)'
                    }
                },
                axisLabel: {
                    color: 'rgba(22, 22, 21, 0.6)'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: 'rgba(22, 22, 21, 0.6)'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(22, 22, 21, 0.05)'
                    }
                }
            },
            series: [{
                data: [12, 19, 15, 28, 22, 35, 30],
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 3,
                    color: '#5751D5'
                },
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#5751D5',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: 'rgba(87, 81, 213, 0.2)'},
                        {offset: 1, color: 'rgba(87, 81, 213, 0)'}
                    ])
                }
            }]
        };
        usageChart.setOption(usageOption);
    
        // 时间分布图表
        const distributionChart = echarts.init(document.getElementById('distribution-chart'));
        const distributionOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: 0,
                left: 'center',
                textStyle: {
                    color: 'rgba(22, 22, 21, 0.7)'
                }
            },
            series: [{
                name: '时间分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#161615'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 35, name: '工作', itemStyle: {color: '#5751D5'}},
                    {value: 25, name: '休息', itemStyle: {color: '#8D88F8'}},
                    {value: 20, name: '学习', itemStyle: {color: '#B3AFF5'}},
                    {value: 15, name: '运动', itemStyle: {color: '#D8D5F2'}},
                    {value: 5, name: '其他', itemStyle: {color: '#ECEAF9'}}
                ]
            }]
        };
        distributionChart.setOption(distributionOption);
    
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            usageChart.resize();
            distributionChart.resize();
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                anime({
                    targets: window,
                    scrollTop: targetElement.offsetTop - 80,
                    duration: 1000,
                    easing: 'easeOutQuart'
                });
            }
        });
    });
});