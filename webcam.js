

function init() {
	
	var video = document.getElementsByTagName('video')[0],
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    frames = [],
    task = null;
	
    try {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    } catch (e) {
        window.alert('Your browser does not support WebVideo, try Google Chrome');
    }
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, function (stream) {
            console.log('stream', stream);
            video.src = window.URL.createObjectURL(stream);
        }, function (e) {
            window.alert('Please enable your webcam to begin recording');
        });
    } else {
        window.alert('Your browser does not support recording, try Google Chrome');
    }
}

function captureFrame(time) {
    task = requestAnimationFrame(captureFrame);
    context.drawImage(video, 0, 0, 320, 240);
    frames.push(canvas.toDataURL('image/webp', 1)); // image/jpeg is faster
};

function record() {
    console.log('record', video.src);
    frames = [];
    task = requestAnimationFrame(captureFrame);
}

function stop() {
    console.log('stop', frames.length);
    cancelAnimationFrame(task);
}

function load() {
    video.src = window.URL.createObjectURL(Whammy.fromImageArray(frames, 1000 / 60));
}