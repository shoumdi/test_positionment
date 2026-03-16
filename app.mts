interface match {
    id: number,
    equipe1: string,
    equipe2: string,
    date: string,
    heure: string,
    stade: string,
    prix: { tribune: number, virage: number, pelouse: number }
}
interface reservation {
    matchId: number
    category: string
    nbTickets: number
}
const matchs: Array<match> = [
    {
        id: 1, equipe1: "FC GenV", equipe2: "OC Youssoufia",
        date: "15/03/2025", heure: "20:00", stade: "Stade Mohammed V",
        prix: { tribune: 200, virage: 100, pelouse: 50 }
    },
    {
        id: 2, equipe1: "FC GenV", equipe2: "FC Bayern",
        date: "22/03/2025", heure: "18:00", stade: "Stade Mohammed V",
        prix: { tribune: 250, virage: 120, pelouse: 60 }
    },
    {
        id: 3, equipe1: "FC GenV", equipe2: "Madrid CF",
        date: "05/04/2025", heure: "21:00", stade: "Stade Mohammed V",
        prix: { tribune: 300, virage: 150, pelouse: 80 }
    }
];

const reservations: Array<reservation> = []
const matchList = document.createDocumentFragment()

matchs.forEach(m => {
    matchList.appendChild(addCard(m))
});

document.getElementById('listofmatches')?.appendChild(matchList);

function addCard(item: match) {
    const li = document.createElement('li');
    const card = document.createElement('article')

    const title = document.createElement('h4')
    title.innerText = item.equipe1 + ' VS ' + item.equipe2
    const info = document.createElement('p')
    info.innerText = item.date + ' hour: ' + item.heure + ' stade: ' + item.stade
    const prix = document.createElement('span');
    prix.innerText = `prices : tribune: ${item.prix.tribune}, virage:, ${item.prix.virage}, pelouse: ${item.prix.pelouse}`
    const reserver = document.createElement('a')
    reserver.innerText = 'reserver'
    reserver.href = '#reservationFromulair'
    reserver.addEventListener('click', () => {
        (document.getElementById('select') as HTMLSelectElement).value = `${item.id}`
    })

    card.appendChild(title)
    card.appendChild(info)
    card.appendChild(prix)
    card.appendChild(reserver)

    li.appendChild(card);
    return li
}


function getMatchById(id: number) {
    return matchs.find((m) => m.id === id)
}

function sortByPrice(category: string) {
    switch (category) {
        case 'pelouse': return matchs.sort((m1, m2) => m1.prix.pelouse - m2.prix.pelouse);
        case 'tribune': return matchs.sort((m1, m2) => m1.prix.tribune - m2.prix.tribune);
        case 'virage': return matchs.sort((m1, m2) => m1.prix.virage - m2.prix.virage);
        default: return matchs;
    }
}

function getMatchPrix(match: match | undefined, category: string) {
    if (match === undefined) return 0;
    switch (category) {
        case 'pelouse': return match.prix.pelouse;
        case 'tribune': return match.prix.tribune;
        case 'virage': return match.prix.virage;
        default: return 0;
    }
}

function getTotal(reservations: Array<reservation>) {
    return reservations.reduce((previous, current) => {
        const match = getMatchById(current.matchId)
        return previous += getMatchPrix(match, current.category) * current.nbTickets
    }, 0)
}

function getMatchInfo(match: match) {
    return `${match.equipe1} vs ${match.equipe2} — ${match.date} à ${match.heure} — Stade ${match.stade}`
}


function submit(e: Event) {
    const errors = []
    const form = e.target as HTMLFormElement
    const emailReg: RegExp = new RegExp('\^[a-zA-Z]w+@w+.[a-zA-Z]{2,}')
    if (!emailReg.test(form.email)) errors.push({ email: 'invalid email' });
    const nameReg: RegExp = new RegExp('\^[a-zA-Z]*\D')
    if (!nameReg.test(form.name)) errors.push({ name: 'invalid name' });
    if (form.phone && form.phone.length !== 10) errors.push({ phone: 'invalid phone' });
    if (!form.match.value) errors.push({ match: 'match not selected' });
    if (!form.category.value) errors.push({ category: 'category not selected' });
    if (form.number < 1 || form.number > 10) errors.push({ tickets: 'ticket value' });
    if (form.aggrement) errors.push({ aggrement: 'must aggree to ...' });
    if (errors.length === 0) {
        reservations.push({
            matchId: form.match.value,
            category: form.category,
            nbTickets: form.number
        })
        const counter = document.getElementById('counter')
        if (counter) counter.innerText = `(${reservations.length} reserved)`
        if (form.parentElement)
            form.parentElement.innerHTML += '<p class="bg-green-400 p-5 text-white">success</p>';
        form.reset()
    }

}
console.log("ts mounted");
