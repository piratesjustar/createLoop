const event = require('./event');

module.exports = animationLoop

//internal script
function animationLoop({
    framesPerSecond,
    duration,
    loop
} = {}) {

    const onLoop = event()
    const onPostRender = event()
    const onPreRender = event()

    onPreRender.addListener(updateLoopInfo)
    const framesPerLoop = Math.floor(duration * framesPerSecond)
    const frameDeltaTime = (1 / framesPerSecond) * 1000

    Object.assign(loop, {
        start,
        onLoop,
        onPreRender,
        onPostRender,
        preRender: _ => onPreRender.invoke(),
        postRender: _ => onPostRender.invoke(),
        animationFrame: _ => onAnimationFrame.invoke(),
        get framesPerLoop() { return framesPerLoop },
        get framesPerSecond() { return framesPerSecond },
        // get duration() { return duration },
        get frameDeltaTime() { return frameDeltaTime },
        elapsedFrames: -1,
        elapsedLoops: -1,
        progress: undefined,
        theta: undefined
    })


    function start(renderCallback) {
        let lt = 0
        onAnimationFrame()
        function onAnimationFrame() {
            let dt = Date.now() - lt
            if (dt >= loop.frameDeltaTime)
                onLoopFrame()
            requestAnimationFrame(onAnimationFrame)
        }

        function onLoopFrame() {
            lt = Date.now()
            onPreRender.invoke()
            renderCallback()
            onPostRender.invoke()
        }
    }

    function updateLoopInfo() {
        loop.elapsedFrames++
        if (loop.elapsedFrames % loop.framesPerLoop === 0) {
            loop.elapsedFrames = 0
            loop.elapsedLoops++
            loop.progress = loop.elapsedFrames / loop.framesPerLoop
            loop.theta = (loop.progress * Math.PI * 2)
            // console.log(`on loop ${loop.elapsedLoops}`);
            onLoop.invoke()
        } else {
            loop.progress = loop.elapsedFrames / loop.framesPerLoop
            loop.theta = (loop.progress * Math.PI * 2)
        }
        // console.log(`on frame ${loop.elapsedFrames}, loop ${loop.elapsedLoops}`);
    }
}