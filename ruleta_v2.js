import fetch from "node-fetch";

const RED = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, , 161, 14, 9, 18, 7, 12, 3]
const roll = async (bet, wager) => {
    // console.log("rolling", bet)
    // odd, even, low, high, red,
    //     black, green, or[0 through 36]
    // let bet = ""


    // const url = `https://www.roulette.rip/api/play?bet=${bet}&wager=${wager}`;

    // const r = await fetch(url)

    // return (await r.json())?.bet?.payout

    let payout = 0
    const outcome = Math.floor(Math.random() * 37);
    switch (bet) {


        case "odd":
            if ((outcome % 2) % 2 > 0)
                payout += wager * 2
            return payout

        case "even":
            if ((outcome % 2) % 2 == 0)
                payout += wager * 2
            return payout

        case "low":
            if (outcome <= 12)
                payout += wager * 2
            return payout

        case "high":
            if (outcome > 12)
                payout += wager * 2
            return payout

        case "red":
            if (RED.findIndex(i => i == outcome) >= 0)
                payout += wager * 2
            return payout


        case "black":
            if (RED.findIndex(i => i == outcome) < 0)
                payout += wager * 2
            return payout


        case "green":
            if (outcome == 0) {

                payout = wager * 37
            }
            return payout

        // case 7:
        //     payout = wager * 100

        //     return payout
        // case 8:
        //     payout = wager * 100

        //     return payout

    }



    if (outcome == bet) {
        payout = wager * 36
    }
    return payout









}

const POSSIBLE_BETS = [
    "odd", "even", "low", "high", "red", "black", "green",
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
]
const testStrategy = async (starting, strategy, nOfRolls) => {

    const { bet, wager, threshold } = strategy

    let money = 0 + starting

    const wageringMoney = starting * wager

    for (let i = 0; i < nOfRolls; i++) {


        const payout = await roll(bet, wageringMoney)
        money = money - money * wager + Number(payout)

        if (money <= wageringMoney) break
        if (money >= starting * (threshold)) break

    }
    return money
    // const result = l.map(async i => {
    //     const payout = await roll(bet, money * wager)

    //     money = money - money * wager + Number(payout)

    //     return money
    // })


    // return await result[4]
}

const shuffleArray = (array) => {

    let oldArr = [...array]
    let newArr = []
    while (oldArr.length > 0) {
        let r1 = Math.floor(Math.random() * oldArr.length)
        newArr.push(oldArr[r1])
        oldArr = oldArr.filter((x, i) => i != r1)
    }
    return newArr
}


const generateOffspring = (strategy1, strategy2) => {
    let newStrategies = [
        { bet: strategy1.bet, wager: strategy1.wager, threshold: strategy2.threshold, },
        { bet: strategy1.bet, wager: strategy2.wager, threshold: strategy1.threshold, },
        { bet: strategy1.bet, wager: strategy2.wager, threshold: strategy2.threshold, },
        { bet: strategy2.bet, wager: strategy1.wager, threshold: strategy1.threshold, },

        { bet: strategy2.bet, wager: strategy1.wager, threshold: strategy1.threshold, },
        { bet: strategy2.bet, wager: strategy1.wager, threshold: strategy2.threshold, },
        { bet: strategy2.bet, wager: strategy2.wager, threshold: strategy1.threshold, },

    ]

    newStrategies = shuffleArray(newStrategies)

    // const randomNumber = Math.floor(Math.random() * 4);

    // newStrategies[Math.floor(Math.random() * 7)].wager = generateRandomWager()
    newStrategies[0].wager = generateRandomWager()
    newStrategies[1].bet = generateRandomBet()
    newStrategies[2].threshold = generateRandomThreshold()
    newStrategies[3].wager = generateRandomWager()
    newStrategies[4].bet = generateRandomBet()
    newStrategies[5].threshold = generateRandomThreshold()


    return shuffleArray(newStrategies)

}



const chooseBestStrategy = async (starting, strategies, nOfRolls) => {
    // const results = strategies.map(async s => await testStrategy(s))
    const results = await Promise.all(strategies.map(async s => testStrategy(starting, s, nOfRolls)))

    let total = 0


    // total = total / results.slice(0, 3).length
    const highestIndexes = sortIndexes(results)
    total += results[highestIndexes[0]] + results[highestIndexes[1]] + results[highestIndexes[2]]
    // total = Math.floor(total / 3)

    results.map(r => total = total + r)
    total = Math.floor(total / results.length)

    // console.log("avarage earnings", results.map(r => Math.floor(r * 10) / 10), total)


    // console.log("avarage earnings", total)
    console.log("avarage earnings", Math.floor(results[highestIndexes[0]]), Math.floor(results[highestIndexes[1]]), Math.floor(results[highestIndexes[2]]), total);

    // console.log("earnings", results)

    // console.log("earnings", results[highestIndexes[0]], results[highestIndexes[1]])
    return sortByIndexOrder(strategies, highestIndexes)


    // let maxIndex = results.indexOf(Math.max(...results));
    // console.log("bestEarnings", Math.max(...results));

    // results[maxIndex] = -Infinity; // set max value to -Infinity to find 2nd max

    // let secondMaxIndex = results.indexOf(Math.max(...results));
    // console.log("2nd bestEarnings", Math.max(...results));

    // return [strategies[maxIndex], strategies[secondMaxIndex]]

}

function sortIndexes(arr) {
    const sortedIndexes = [...arr.keys()].sort((a, b) => arr[b] - arr[a])
    // .slice(0, n);
    return sortedIndexes;
}

function sortByIndexOrder(arr, indexOrder) {
    const sortedArray = [];
    indexOrder.forEach((index) => sortedArray.push(arr[index]));
    return sortedArray;
}



// console.log(await testStrategy(1000, { bet: 10, wager: 10 }))
// console.log(await chooseBestStrategy(STARTING_MONEY, strategies))

// console.log(generateOffspring({ bet: 10, wager: 0.01 }, { bet: "even", wager: 0.02 }))

// console.log(await testStrategy(1000, { bet: "even", wager: 0.02 }))


const generateRandomBet = () => {
    const randomBet = Math.floor(Math.random() * 13);
    if (randomBet >= 8) { return Math.floor(Math.random() * 37); }

    return POSSIBLE_BETS[randomBet]
}

const generateRandomWager = () => {
    return Math.floor(Math.random() * 1000) / 1000
    const wagerrr = 1 / 2 ** Math.floor(Math.random() * 9)

    return wagerrr
    return Math.floor(1 / Math.floor(Math.random() * 1000) * 10000) / 10000

    return Math.floor(Math.random() * 10000) / 10000
}

const generateRandomThreshold = () => {
    return 3 * Math.floor(Math.random() * 1000) / 1000
    return 2 ** Math.floor(Math.random() * 12) / 100
    return Math.floor(Math.random() * 37)
    const threshhh = 1.01 ** 2 ** Math.floor(Math.random() * 9) - 1
    return threshhh
}

const generateRandomStrategy = () => {
    return { bet: generateRandomBet(), wager: generateRandomWager(), threshold: generateRandomThreshold() }
}

const main = async () => {
    const firstStrategies = []


    for (let i = 0; i < 15; i++) {
        firstStrategies.push(generateRandomStrategy())
    }

    console.log(firstStrategies);

    let currentStrategies = [...firstStrategies]

    let best2 = []



    for (let i = 0; i < ITERATIONS; i++) {
        const orderedStategies = await Promise.all(await chooseBestStrategy(STARTING_MONEY, currentStrategies, NOFROLLS))


        const offspring1 = generateOffspring(...orderedStategies.slice(0, 2))
        const offspring2 = generateOffspring(orderedStategies[0], orderedStategies[2])
        const offspring3 = generateOffspring(orderedStategies[1], orderedStategies[2])


        // const currentOffspring = generateOffspring(...best2)
        currentStrategies = [...orderedStategies.slice(0, 3), ...offspring1.slice(0, 4), ...offspring2.slice(0, 3), ...offspring3.slice(0, 2), ...orderedStategies.slice(3, 5)]
        // console.log("currentOffspring", currentOffspring);
        // currentStrategies = [...best2, ...currentOffspring, orderedStategies.slice(3, 14)]

        for (let i = 0; i < 1; i++) {
            currentStrategies.push(generateRandomStrategy())
        }
        console.log("best", currentStrategies.slice(0, 3))
        // console.log("currentStrategies", currentStrategies)


    }
    // console.log("best", currentStrategies.slice(0, 3))
}

const STARTING_MONEY = 1000
const NOFROLLS = 300
const ITERATIONS = 50



main()

