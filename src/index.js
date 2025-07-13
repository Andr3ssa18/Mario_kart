const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, answer => {
            resolve(answer);
        });
    });
}

function playersChoose(character1Name, character2Name) {
    const normalize = (name) => (typeof name === 'string' ? name.trim().toLowerCase() : '');

    const c1 = normalize(character1Name);
    const c2 = normalize(character2Name);

    const charactersMap = {
        "mario": {
            NOME: "Mario",
            VELOCIDADE: 4,
            MANOBRABILIDADE: 3,
            PODER: 3,
            PONTOS: 0,
        },
        "peach": {
            NOME: "Peach",
            VELOCIDADE: 3,
            MANOBRABILIDADE: 4,
            PODER: 2,
            PONTOS: 0,
        },
        "yoshi": {
            NOME: "Yoshi",
            VELOCIDADE: 2,
            MANOBRABILIDADE: 4,
            PODER: 3,
            PONTOS: 0,
        },
        "bowser": {
            NOME: "Bowser",
            VELOCIDADE: 5,
            MANOBRABILIDADE: 2,
            PODER: 5,
            PONTOS: 0,
        },
        "luigi": {
            NOME: "Luigi",
            VELOCIDADE: 3,
            MANOBRABILIDADE: 4,
            PODER: 4,
            PONTOS: 0,
        },
        "donkey kong": {
            NOME: "Donkey Kong",
            VELOCIDADE: 2,
            MANOBRABILIDADE: 2,
            PODER: 5,
            PONTOS: 0,
        },
    };

    const player1Obj = charactersMap[c1];
    const player2Obj = charactersMap[c2];

    if (!player1Obj) {
        console.log(`Personagem "${character1Name}" não faz parte dos personagens de Mario kart 🚗`);
        return null;
    }
    if (!player2Obj) {
        console.log(`Personagem "${character2Name}" não faz parte dos personagens de Mario kart 🚗`);
        return null;
    }

    return [{ ...player1Obj }, { ...player2Obj }];
}

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.33:
            result = "RETA";
        break;
        case random < 0.66:
            result = "CURVA";
        break;
        default:
            result = "CONFRONTO";
    }

    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(
        `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${
        diceResult + attribute
        }`
    );
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        // sortear bloco
        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        // rolar os dados
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        //teste de habilidade
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(
                character1.NOME,
                "velocidade",
                diceResult1,
                character1.VELOCIDADE
            );

            await logRollResult(
                character2.NOME,
                "velocidade",
                diceResult2,
                character2.VELOCIDADE
            );
        }

        if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(
                character1.NOME,
                "manobrabilidade",
                diceResult1,
                character1.MANOBRABILIDADE
            );

            await logRollResult(
                character2.NOME,
                "manobrabilidade",
                diceResult2,
                character2.MANOBRABILIDADE
            );
        }

        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

            await logRollResult(
                character1.NOME,
                "poder",
                diceResult1,
                character1.PODER
            );

            await logRollResult(
                character2.NOME,
                "poder",
                diceResult2,
                character2.PODER
            );

            const questionBlock = ["casco 🐢", "bomba 💣"];
                function raffle() {
                const luck = Math.floor(Math.random() * questionBlock.length);
                return questionBlock[luck];
            }

            if (powerResult1 > powerResult2) {
                const item = raffle();
                let lostPoints = item === "casco 🐢" ? 1 : 2;

                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu ${lostPoints} ponto(s) bateu em um(a) ${item}`);
                character2.PONTOS = Math.max(0, character2.PONTOS - lostPoints);

                if (Math.random() < 0.5) {
                    console.log(`${character1.NOME} ganhou um turbo e marcou 1 ponto extra! 🍄`);
                    character1.PONTOS++;
                }
            } else if (powerResult2 > powerResult1) {
                const item = raffle();
                let lostPoints = item === "casco 🐢" ? 1 : 2;

                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu ${lostPoints} ponto(s) bateu em um(a) ${item}`);
                character1.PONTOS = Math.max(0, character1.PONTOS - lostPoints);

                if (Math.random() < 0.5) {
                    console.log(`${character2.NOME} ganhou um turbo e marcou 1 ponto extra! 🍄`);
                    character2.PONTOS++;
                }
            } else {
                console.log("Confronto empatado! Nenhum ponto foi perdido");
            }
        }

        console.log(`🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪🟥🟧🟨`);
    }
}


function declareWinner(character1, character2) {
    console.log("\nResultado final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
    } else {
        console.log("\nA corrida terminou em empate!");
    }
}

(async function main() {
    console.log("------PERSONAGENS:------\n");
    console.log("------Mario:------\nVelocidade: 4\nManobrabilidade: 3\nPoder: 3\n");
    console.log("------Peach:------\nVelocidade: 3\nManobrabilidade: 4\nPoder: 2\n");
    console.log("------Yoshi:------\nVelocidade: 2\nManobrabilidade: 4\nPoder: 3\n");
    console.log("------Bowser:------\nVelocidade: 5\nManobrabilidade: 2\nPoder: 5\n");
    console.log("------Luigi:------\nVelocidade: 3\nManobrabilidade: 4\nPoder: 4\n");
    console.log("------Donkey Kong:------\nVelocidade: 2\nManobrabilidade: 2\nPoder: 5\n");

    let players;
    do {
        const player1Name = await askQuestion("Digite o nome do 1° personagem: ");
        const player2Name = await askQuestion("Digite o nome do 2° personagem: ");

        players = playersChoose(player1Name, player2Name);

        if (!players) {
        console.log("Tente novamente...\n");
        }
    } while (!players);

    const [player1, player2] = players;

    console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);

    await playRaceEngine(player1, player2);
    declareWinner(player1, player2);

    rl.close();
})();
