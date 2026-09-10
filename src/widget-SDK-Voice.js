import { Desktop } from "@wxcc-desktop/sdk";

const template = document.createElement("template");

template.innerHTML = `
<style>

:host{
    display:block;
    width:100%;
    height:100%;
}

.container{
    padding:12px;
}

#buttonContainer{

    display:grid;

    grid-template-columns:repeat(5, 1fr);

    gap:12px;
}

.transferTile{

    min-height:120px;

    border:2px solid #F2B500;

    border-radius:12px;

    background:#ffffff;

    cursor:pointer;

    transition:.2s;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;
}

.transferTile:hover{

    transform:translateY(-2px);

    box-shadow:
        0 4px 12px rgba(0,0,0,.15);

}

.logo{

    font-size:32px;

    color:#F2B500;

    margin-bottom:10px;
}

.label{

    font-family:Poppins,sans-serif;

    font-size:18px;

    font-weight:600;

    color:#003B71;

    text-align:center;
}

</style>

<div class="container">

    <div id="buttonContainer">

    </div>

</div>
`;

const logger =
    Desktop.logger.createLogger(
        "StarkeyReceptionistConsole"
    );

class StarkeyReceptionistConsole extends HTMLElement {

    constructor() {

        super();

        this.attachShadow({
            mode:"open"
        });

        this.shadowRoot.appendChild(
            template.content.cloneNode(true)
        );
    }

    connectedCallback() {

        this.init();

    }

    async init() {

        Desktop.config.init();

        await this.loadButtons();

    }

    async loadButtons() {

        try {

            const response =
                await fetch(
                    "./buttons.json"
                );

            const buttons =
    await response.json();

console.log(
    "Starkey Buttons Loaded:",
    buttons
);

this.renderButtons(
    buttons
);


        }
        catch(error) {

            console.error(
                "Failed loading buttons",
                error
            );

        }
    }
renderButtons(buttons) {

    const container =
        this.shadowRoot.getElementById(
            "buttonContainer"
        );

    container.innerHTML = "";

    buttons.forEach(button => {

        const tile =
            document.createElement(
                "div"
            );

        tile.classList.add(
            "transferTile"
        );

        tile.innerHTML = `
            <div class="logo">
                ★
            </div>

            <div class="label">
                ${button.label}
            </div>
        `;

        container.appendChild(
            tile
        );

    });

}
}

customElements.define(
    "sa-ds-voice-sdk",
    StarkeyReceptionistConsole
);