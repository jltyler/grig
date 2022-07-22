import presets from "./presets.js";

const defaultFunction = (i) => {
    const r = 128 + 127 * Math.sin((i.x / 5) * (i.timestamp / 1000));
    const g = 128 + 127 * Math.sin(i.y / 3);
    const b = 128 + 127 * Math.sin(i.timestamp / 2000);
    return `rgb(${r},${g},${b})`;
}

function init() {
    console.log("Initializing...");

    const containerElement = document.getElementById("container");
    const controlsContainerElement = document.getElementById("controls-container");
    const codeBoxElement = document.getElementById("code-box");
    const submitElement = document.getElementById("submit");
    const showButton = document.getElementById("show");
    const hideButton = document.getElementById("hide");
    const errorDisplay = document.getElementById("error-display");

    const inputRangeA = document.getElementById("input-a-range");
    const inputBoxA = document.getElementById("input-a-box");
    const inputRangeB = document.getElementById("input-b-range");
    const inputBoxB = document.getElementById("input-b-box");
    const inputRangeC = document.getElementById("input-c-range");
    const inputBoxC = document.getElementById("input-c-box");
    const inputRangeD = document.getElementById("input-d-range");
    const inputBoxD = document.getElementById("input-d-box");

    const gridSizeSelect = document.getElementById("grid-size-list");

    const presetSelect = document.getElementById("presets-list");
    const loadButton = document.getElementById("load");

    let gridWidth = 64;
    let gridHeight = 40;

    let grid = [];

    const generateGrid = (width, height) => {
        gridWidth = width;
        gridHeight = height;
        grid = [];
        containerElement.textContent = "";
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
    };

    generateGrid(64,40);

    // Default code
    codeBoxElement.value = `(i) => {
    const r = 128 + 127 * Math.sin((i.x / 5) * (i.timestamp / 1000));
    const g = 128 + 127 * Math.sin(i.y / 3);
    const b = 128 + 127 * Math.sin(i.timestamp / 2000);
    return \`rgb(\${r},\${g},\${b})\`;
}`;

    // UI Controls
    hideButton.addEventListener("click", (e) => {
        controlsContainerElement.style.display = 'none';
        showButton.style.display = 'inline';
    });

    showButton.addEventListener("click", (e) => {
        controlsContainerElement.style.display = 'flex';
        showButton.style.display = 'none';
    });

    let customValueA = 1;
    let customValueB = 1;
    let customValueC = 1;
    let customValueD = 1;

    // Slider Events
    inputRangeA.addEventListener("input", (e) => {
        inputBoxA.value = e.target.value;
        customValueA = parseFloat(e.target.value);
    });

    inputBoxA.addEventListener("input", (e) => {
        if (e.target.value < 0) e.target.value = 0;
        inputRangeA.value = e.target.value;
        customValueA = parseFloat(e.target.value);
    });

    inputRangeB.addEventListener("input", (e) => {
        inputBoxB.value = e.target.value;
        customValueB = parseFloat(e.target.value);
    });

    inputBoxB.addEventListener("input", (e) => {
        if (e.target.value < 0) e.target.value = 0;
        inputRangeB.value = e.target.value;
        customValueB = parseFloat(e.target.value);
    });

    inputRangeC.addEventListener("input", (e) => {
        inputBoxC.value = e.target.value;
        customValueC = parseFloat(e.target.value);
    });

    inputBoxC.addEventListener("input", (e) => {
        if (e.target.value < 0) e.target.value = 0;
        inputRangeC.value = e.target.value;
        customValueC = parseFloat(e.target.value);
    });

    inputRangeD.addEventListener("input", (e) => {
        inputBoxD.value = e.target.value;
        customValueD = parseFloat(e.target.value);
    });

    inputBoxD.addEventListener("input", (e) => {
        if (e.target.value < 0) e.target.value = 0;
        inputRangeD.value = e.target.value;
        customValueD = parseFloat(e.target.value);
    });

    // UI for grid size
    gridSizeSelect.addEventListener("input", (e) => {
        switch (e.target.value) {
            case "huge":
                generateGrid(96,60);
                break;
            case "medium":
                generateGrid(40,25);
                break;
            case "small":
                generateGrid(16,10);
                break;
            case "big":
            default:
                generateGrid(64,40);
                break;
        }
    });

    // UI for presets
    Object.keys(presets).map((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.innerText = name;
        presetSelect.appendChild(opt);
    });


    let handler = defaultFunction;

    const submitEvent = (e) => {
        const t = eval(codeBoxElement.value);
        // console.log('t:', t);
        if (typeof t === "function") handler = t;
        try {
            t({timestamp: 0, delta: 0, x: 0, y: 0, width: 1, height: 1, a:0, b:0, c:0, d:0});
        } catch (error) {
            errorDisplay.innerText = `${error.name}: ${error.message}\nLine: ${error.lineNumber}`;
            window.setTimeout(() => {errorDisplay.innerText = "";}, 4000);

            handler = defaultFunction;
        }
    };

    loadButton.addEventListener("click", (e) => {
        const preset = presets[presetSelect.value];
        codeBoxElement.value = preset.code;

        customValueA = preset.a;
        inputBoxA.value = preset.a;
        inputRangeA.value = preset.a;

        customValueB = preset.b;
        inputBoxB.value = preset.b;
        inputRangeB.value = preset.b;

        customValueC = preset.c;
        inputBoxC.value = preset.c;
        inputRangeC.value = preset.c;

        customValueD = preset.d;
        inputBoxD.value = preset.d;
        inputRangeD.value = preset.d;

        submitEvent();
    });

    submitElement.addEventListener('click', submitEvent);

    let last = performance.now();

    const animateFrame = (timestamp) => {

        const delta = (timestamp - last) / 1000;
        last = timestamp;

        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                let color = "black";
                const inputObject = {
                    timestamp,
                    delta,
                    x,
                    y,
                    width: gridWidth,
                    height: gridHeight,
                    a: customValueA,
                    b: customValueB,
                    c: customValueC,
                    d: customValueD,
                };

                if (typeof handler === "function") {
                    color = handler(inputObject);
                } else {
                    console.warn("Handler is not a function");
                }

                grid[x][y].style.setProperty("background-color", color);
            }
        }
        window.requestAnimationFrame(animateFrame);
    };

    // Start
    window.requestAnimationFrame(animateFrame);
}

window.addEventListener('load', init);