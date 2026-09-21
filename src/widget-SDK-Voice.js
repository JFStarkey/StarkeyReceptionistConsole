import { Desktop } from "@wxcc-desktop/sdk";

const logger =
    Desktop.logger.createLogger(
        "StarkeyReceptionistConsole"
    );

const template = document.createElement("template");

template.innerHTML = `
<style>

:host{
    display:block;
    width:100%;
    height:100%;
}

.container{

    padding:10px;

    height:100%;

    overflow-y:auto;

    overflow-x:hidden;

    box-sizing:border-box;

    background-color:##FDFEFF;

}

.container::-webkit-scrollbar {

    width: 10px;

}

.container::-webkit-scrollbar-track {

    background: #f1f1f1;

    border-radius: 10px;

}

.container::-webkit-scrollbar-thumb {

    background: #003B71;

    border-radius: 10px;

}

.container::-webkit-scrollbar-thumb:hover {

    background: #fff;

}

#buttonContainer{

    display:grid;

    grid-template-columns:repeat(5, 1fr);

    gap:5px;
}

.transferTile {

    min-height: 70px;

    border: 2px solid #F2B500;

    border-radius: 16px;

    background-color: #00264d;

    cursor: pointer;

    transition: .2s;

    display: flex;

    justify-content: center;

    align-items: stretch;
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

.label {

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    width:100%;

    height:100%;

    box-sizing:border-box;

    padding:15px;

    position:relative;

}

.queueName {

    font-family:
        "Segoe UI",
        sans-serif;

    font-size:26px;

    font-weight:700;

    color:#fff;

    line-height:1.2;

}

.queueExtension {

    position:absolute;

    bottom:5px;

    right:15px;

    font-family:
        "Segoe UI",
        sans-serif;

    font-size:16px;

    font-weight:600;

    color:#fff;

}


</style>

<div class="container">

    <div id="buttonContainer">

    </div>

</div>
`;


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

    console.log(
        "Starkey Receptionist Console"
    );

    Desktop.config.init();

    await this.loadButtons();

}

async loadButtons() {

    try {

        console.log(
            "STEP 1 - Loading buttons"
        );

        const response =
            await fetch(
                "https://jfstarkey.github.io/StarkeyReceptionistConsole/buttons.json"
            );

        console.log(
            "STEP 2 - Response:",
            response.status
        );

        const buttons =
            await response.json();

        console.log(
            "STEP 3 - Buttons:",
            buttons
        );

        this.renderButtons(
            buttons
        );

        console.log(
            "STEP 4 - Render complete"
        );

    }
    catch(error) {

        console.error(
            "BUTTON LOAD FAILED"
        );

        console.error(error);

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

        const parts = button.label.split(" ");

        let name;
        let extension = "";

        if (
            parts.length > 1 &&
            /^\d+$/.test(parts[parts.length - 1])
        ) {

            extension = parts.pop();

            name = parts.join(" ");

        }
        else {

            name = button.label;

        }

        tile.innerHTML = `
            <div class="label">

                <div class="queueName">
                    ${name}
                </div>

                <div class="queueExtension">
                    ${extension || "&nbsp;"}
                </div>

            </div>
        `;

        tile.addEventListener(
            "click",
            () => {

                console.log(
                    "Transfer Clicked:",
                    button.label,
                    button.destination
                );

                this.transferToDN(
                    button.destination
                );

            }
        );

        container.appendChild(
            tile
        );

    });

}

async getInteractionId() {

    const currentTaskMap =
        await Desktop.actions.getTaskMap();

    for (const iterator of currentTaskMap) {

        return iterator[1]
            .interactionId;

    }

}

async transferToDN(phoneDN) {

    try {

        const interactionId =
            await this.getInteractionId();

        console.log(
            "Transfering to:",
            phoneDN
        );

        const response =
            await Desktop.agentContact
                .blindTransfer({

                    interactionId,

                    data: {

                        destAgentId:
                            phoneDN,

                        mediaType:
                            "telephony",

                        destinationType:
                            "EP-DN"

                    }

                });

        console.log(
            "Transfer successful",
            response
        );

    }
    catch(error) {

        console.error(
            "Transfer failed",
            error
        );

    }

}

}

customElements.define(
    "sa-ds-voice-sdk",
    StarkeyReceptionistConsole
);