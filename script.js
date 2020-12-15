let input = document.querySelector('.use-keyboard-input');

const Keyboard = {
elements: {
main: null,
keysContainer: null,
keys: []
},

eventHandlers: {
oninput: null,
onclose: null
},

properties: {
value: "",
capsLock: false,
shift: false,
ctrl: false,
buffer: '',
start: 0,
end: 0,
direction: 'none',
language: true
},

init() {
// Create main elements
this.elements.main = document.createElement("div");
this.elements.keysContainer = document.createElement("div");

// Setup main elements
this.elements.main.classList.add("keyboard", "keyboard--hidden");
this.elements.keysContainer.classList.add("keyboard__keys");
this.elements.keysContainer.appendChild(this._createKeys());

this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

// Add to DOM
this.elements.main.appendChild(this.elements.keysContainer);
document.body.appendChild(this.elements.main);

// Automatically use keyboard for elements with .use-keyboard-input
document.querySelectorAll(".use-keyboard-input").forEach(element => {
    
    element.addEventListener("focus", () => {
    this.open(element.value, currentValue => {
        console.log(element.value, currentValue)
        element.value = currentValue;
    });
    });
    element.addEventListener('click', () => {
    //позиция курсора
    this.properties.start = input.selectionStart;
    this.properties.end = input.selectionEnd;
    });
    element.addEventListener("keypress", key => {
    //ввод с физической клавиатуры
    this.properties.value+=key.key;
    this.open(element.value, currentValue => {
        if (this.properties.start > element.value.length) {
        element.value += currentValue.substring(currentValue.length - 1, currentValue.length);
        }
        else {
        element.value = element.value.substring(0, this.properties.start-1)
            + currentValue.substring(this.properties.start-1, this.properties.end) 
            + element.value.substring(this.properties.end-1, element.value.length);
        }
    });
    this.properties.start++;
    this.properties.end++;
    });
    element.addEventListener('keydown', key => {
    //стрелки вправо и влево
    if (key.which === 37) {
        this.properties.start--;
        this.properties.end--;
        if (this.properties.start < 0) this.properties.start = 0;
        if (this.properties.end < 0) this.properties.end = 0;
    }
    if (key.which === 39) {
        this.properties.start++;
        this.properties.end++;
        if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
        if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
    }
    //ввод физического бекспейса
    if (key.which === 8) {

        // setTimeout( () => {
        //   this.properties.value=input.value;
        // }, 50); 
    }
    });
});
},

_createKeys() {
const fragment = document.createDocumentFragment();
const keyLayoutEn = [
    ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ["[", "{"], ["]", "}"], 
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", [";", ":"], ["'", "\""], "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", [",", "<"], [".", ">"], ["/", "?"],
    "done", "mic","en", "space", "left", "right"
];
const keyLayoutRu = [
    ["1", "!"], ["2", "\""], ["3", "№"], ["4", ";"], ["5", "%"], ["6", ":"], ["7", "?"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", 
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", [".", ","], 
    "done","mic", "ru", "space",  "left",  "right"
];

const createIconHTML = (icon_name) => {
    return `<i class="material-icons">${icon_name}</i>`;
};

let keyLayout;
if (this.properties.language) keyLayout = keyLayoutEn;
else keyLayout = keyLayoutRu;
if (this.properties.shift) 
    for (let i = 0; i < keyLayout.length; i++)
    if (typeof keyLayout[i] !== 'string')
        keyLayout[i].reverse();

keyLayout.forEach(key => {
    const keyElement = document.createElement("button");
    const insertLineBreak = ["backspace", "caps",  "enter", "done"].indexOf(key) !== -1;

    keyElement.setAttribute("type", "button");
    keyElement.classList.add("keyboard__key");

    switch (key) {
    case "en":
        keyElement.innerHTML = 'en';
        keyElement.addEventListener('click', () => {
        this.properties.language = !this.properties.language;
        while (this.elements.keysContainer.children.length > 0) this.elements.keysContainer.children[0].remove();
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
        });
        break;

    case "ru":
        keyElement.innerHTML = 'ru';
        keyElement.addEventListener('click', () => {
        this.properties.language = !this.properties.language;
        while (this.elements.keysContainer.children.length > 0) this.elements.keysContainer.children[0].remove();
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
        });
        break;
        
    case "shift":
        keyElement.innerHTML = createIconHTML("⇧");
        keyElement.classList.add("keyboard__key--verywide", "keyboard__key--activatable");
        if (this.properties.shift === true) keyElement.classList.toggle("keyboard__key_shift");

        keyElement.addEventListener('click', () => {
        this.properties.shift = !this.properties.shift;
        keyElement.classList.toggle("keyboard__key_shift");
        keyElement.classList.toggle("keyboard__key--active", this.properties.shift);

        input.focus();
        for (let i = 0; i < keyLayout.length; i++) {
            if (typeof keyLayout[i] !== 'string') { 
            keyLayout[i].reverse();
                for (const key of this.elements.keys) {
                    if (key.textContent === keyLayout[i][1]) {
                        key.textContent = keyLayout[i][0];
                    }
                }
            } 
        }
        for (const key of this.elements.keys) { 
            if (key.childElementCount === 0 && key.textContent!=="en" && key.textContent!=="caps" && key.textContent!=="CAPS"
                                            && key.textContent!=="ru" && key.textContent!=="капс" && key.textContent!=="КАПС") {
            if (this.properties.capsLock || this.properties.shift) key.textContent=key.textContent.toUpperCase(); 
            else key.textContent=key.textContent.toLowerCase(); 
            if (this.properties.capsLock && this.properties.shift) key.textContent=key.textContent.toLowerCase();
            }
        }
        });
        break;

    case "left": 
        keyElement.classList.add(key);
        keyElement.innerHTML = createIconHTML("keyboard_arrow_"+key);
        keyElement.addEventListener('click', () => {
        if (!this.properties.shift) {
            this.properties.start--;
            this.properties.end--;

            if (this.properties.start < 0) this.properties.start = 0;
            if (this.properties.end < 0) this.properties.end = 0;
            
            input.setSelectionRange(this.properties.start, this.properties.end);
        }
        input.focus();
        });
        break;

    case "right":
        keyElement.classList.add(key);
        keyElement.innerHTML = createIconHTML("keyboard_arrow_"+key);
        keyElement.addEventListener('click', () => {
        if (!this.properties.shift) {
            this.properties.start++;
            this.properties.end++;

            if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
            if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;

            input.setSelectionRange(this.properties.start, this.properties.end);
        }
        input.focus();
        });
        break;

    case "backspace":
        keyElement.classList.add("keyboard__key--wide");
        keyElement.innerHTML = createIconHTML("backspace");

        keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent('oninput');
        } );
        break;

    case "caps":
        keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
        keyElement.innerHTML = createIconHTML("keyboard_capslock");

        keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
        } );
        break;

    case "enter":
        keyElement.classList.add("keyboard__key--wide");
        keyElement.innerHTML = createIconHTML("keyboard_return");
        keyElement.addEventListener("click", () => {
        this.properties.value = this.properties.value.substring(0, this.properties.start) 
            + "\n" 
            + this.properties.value.substring(this.properties.end, this.properties.value.length);

        let range = this.properties.end - this.properties.start;
        if (range > 0) {
            this.properties.end -= range;
        }

        this.properties.start++;
        this.properties.end++;
        this._triggerEvent("oninput");
        input.focus();
        input.setSelectionRange(this.properties.start, this.properties.end);
        });
        break;

    case "space":
        keyElement.classList.add("keyboard__key--extra-wide");
        keyElement.innerHTML = createIconHTML("space_bar");
        keyElement.addEventListener("click", () => {
        this.properties.value = this.properties.value.substring(0, this.properties.start) 
            + ' ' 
            + this.properties.value.substring(this.properties.end, this.properties.value.length);
        this.properties.start++;
        this.properties.end++;
        this._triggerEvent("oninput");
        input.focus();

        let range = this.properties.end - this.properties.start;
        input.setSelectionRange(this.properties.end-range, this.properties.end-range);
        if (range>0) {
            this.properties.end -= range;
        }
        });
        break;

    case "done":
        keyElement.classList.add("keyboard__key--dark");
        keyElement.innerHTML = createIconHTML("keyboard_hide");
        keyElement.addEventListener("click", () => {
        this.close();
        this._triggerEvent("onclose");
        });
        break;

    default:
        if (typeof key === 'string') {

        if (this.properties.capsLock || this.properties.shift)
            keyElement.textContent = key.toUpperCase();
        else keyElement.textContent = key.toLowerCase();
        if (this.properties.capsLock && this.properties.shift)
            keyElement.textContent = key.toLowerCase();
        }
        if (typeof key !== 'string') keyElement.textContent = key[0];
        

        keyElement.addEventListener("click", () => {
        let symbol = key;
        if (typeof symbol !== 'string') symbol = symbol[0];
        if (this.properties.capsLock || this.properties.shift) symbol=symbol.toUpperCase(); 
        else symbol=symbol.toLowerCase(); 
        if (this.properties.capsLock && this.properties.shift) symbol=symbol.toLowerCase(); 

        console.log(this.properties.value, 'value')
        console.log(this.properties.value.substring(0, this.properties.start), 'before')
        console.log(this.properties.value.substring(this.properties.end, this.properties.value.length), 'after')

        this.properties.value = this.properties.value.substring(0, this.properties.start) 
            + symbol
            + this.properties.value.substring(this.properties.end, this.properties.value.length);

        let range = this.properties.end - this.properties.start;
        if (range > 0) {
            this.properties.end-=range;
        }
        this.properties.start++;
        this.properties.end++;
        this._triggerEvent("oninput");
        input.focus();
        input.setSelectionRange(this.properties.start, this.properties.end);
        });
        break;
    }

    fragment.appendChild(keyElement);

    if (insertLineBreak) {
    fragment.appendChild(document.createElement("br"));
    }
});

return fragment;
},

_triggerEvent(handlerName) {
if (typeof this.eventHandlers[handlerName] == "function") {
    this.eventHandlers[handlerName](this.properties.value);
}
},

_toggleCapsLock() {
this.properties.capsLock = !this.properties.capsLock;

for (const key of this.elements.keys) {
    if (key.childElementCount === 0 && key.textContent!=="en" && key.textContent!=="ru") {
    if (this.properties.capsLock || this.properties.shift) key.textContent=key.textContent.toUpperCase(); 
    else key.textContent=key.textContent.toLowerCase(); 
    if (this.properties.capsLock && this.properties.shift) key.textContent=key.textContent.toLowerCase(); 
    }
    if (key.childElementCount === 0 && (key.textContent==='abc' || key.textContent==='ABC' || key.textContent==='абв' || key.textContent==='АБВ')) {
    if(this.properties.capsLock) key.textContent=key.textContent.toUpperCase(); 
    else key.textContent=key.textContent.toLowerCase(); 
    }
}
},



open(initialValue, oninput, onclose) {
this.properties.value = initialValue || "";
this.eventHandlers.oninput = oninput;
this.eventHandlers.onclose = onclose;
this.elements.main.classList.remove("keyboard--hidden");
},

close() {
this.properties.value = "";
this.eventHandlers.oninput = oninput;
this.eventHandlers.onclose = onclose;
this.elements.main.classList.add("keyboard--hidden");
}
};

window.addEventListener("DOMContentLoaded", function () {
Keyboard.init();
});





// window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// var words = document.querySelector(".words");
// var start =  keyElement.classList.add("keyboard__key--extra-wide");
// keyElement.innerHTML = createIconHTML("голос");

// var rec = new SpeechRecognition();
// rec.interimResults = true;

// var p = document.createElement("p");
// words.appendChild(p);

// start.addEventListener("click", function() {
//     rec.start();
//     this.disabled = true;
//     this.innerHTML = "LISTENING...";
// });

// clear.addEventListener("click", function() {
//     words.innerHTML = "";
//     p = document.createElement("p");
//     words.appendChild(p);
// });

// rec.addEventListener("result", function(e) {
//     var text = Array.from(e.results)
//     .map(result => result[0])
//     .map(result => result.transcript)
//     .join('');
    
//     p.innerHTML = text;
// });

// rec.addEventListener("end", function(e) {
//     if (p.innerHTML) {
//         p = document.createElement("p");
//         words.appendChild(p);
//     }
//     rec.start();
// });