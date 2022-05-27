function init() {
    console.log("Initializing...");

    const containerElement = document.getElementById("container");
    const controlsContainerElement = document.getElementById("controls-container");
    const codeBoxElement = document.getElementById("code-box");
    const submitElement = document.getElementById("submit");
    const showButton = document.getElementById("show");
    const hideButton = document.getElementById("hide");
    const errorDisplay = document.getElementById("error-display");

    const width = 48;
    const height = 30;
    let border = false;
    const grid = [];
    for (let x = 0; x < width; x++) {
        grid.push([]);
        const col = document.createElement("div");
        col.classList.add("column");
        for (let y = 0; y < height; y++) {
            const box = document.createElement("div");
            box.classList.add("box");
            col.appendChild(box);
            grid[x].push(box);
        }
        containerElement.appendChild(col);
    }

    hideButton.addEventListener("click", (e) => {
        controlsContainerElement.style.display = 'none';
        showButton.style.display = 'inline';
    });

    showButton.addEventListener("click", (e) => {
        controlsContainerElement.style.display = 'block';
        showButton.style.display = 'none';
    });

    codeBoxElement.value = `(i) => {
    const r = 128 + 127 * Math.sin((i.x / 5) * (i.timestamp / 1000));
    const g = 128 + 127 * Math.sin(i.y / 3);
    const b = 128 + 127 * Math.sin(i.timestamp / 2000);
    return \`rgb(\${r},\${g},\${b})\`;
}`;

    let animate = true;

    const defaultFunction = (i) => {
        const r = 128 + 127 * Math.sin((i.x / 5) * (i.timestamp / 1000));
        const g = 128 + 127 * Math.sin(i.y / 3);
        const b = 128 + 127 * Math.sin(i.timestamp / 2000);
        return `rgb(${r},${g},${b})`;
    }

    let handler = defaultFunction;

    submitElement.addEventListener('click', (e) => {
        const t = eval(codeBoxElement.value);
        // console.log('t:', t);
        if (typeof t === "function") handler = t;
        try {
            t({timestamp: 0, delta: 0, x: 0, y: 0, width: 1, height: 1});
        } catch (error) {
            errorDisplay.innerText = `${error.name}: ${error.message}\nLine: ${error.lineNumber}`;
            window.setTimeout(() => {errorDisplay.innerText = "";}, 4000);

            handler = defaultFunction;
        }
    });

    let last = performance.now();

    const animateFrame = (timestamp) => {

        const delta = (timestamp - last) / 1000;
        last = timestamp;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let color = "black";
                const inputObject = {
                    timestamp,
                    delta,
                    x,
                    y,
                    width,
                    height
                };

                if (typeof handler === "function") {
                    color = handler(inputObject);
                } else {
                    console.warn("Handler is not a function");
                }

                grid[x][y].style.setProperty("background-color", color);
            }
        }
        if (animate) window.requestAnimationFrame(animateFrame);
    };

    // Next frame
    window.requestAnimationFrame(animateFrame);
}

window.addEventListener('load', init);