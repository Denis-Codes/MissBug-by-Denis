import { utilService } from "../../../services/util.service.js"

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}


function get(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .then(bug => _setNextPrevBugId(bug))
}

//OLD

// function get(bugId) {
//     return axios.get(BASE_URL + bugId)
//         .then(res => res.data)
// }

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        severity: 1,
        createdAt: Date.now()
    }
}

function getDefaultFilter() {
    return {
        title: '',
        severity: '',
        description: '',
        sortBy: 'createdAt',
        sortDir: '1',
        pageIdx: 0
    }
}

function _setNextPrevBugId(bug) {
    return query().then((bugs) => {
        const bugsIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugsIdx + 1] ? bugs[bugsIdx + 1] : bugs[0]
        const prevBug = bugs[bugsIdx - 1] ? bugs[bugsIdx - 1] : bugs[bugs.length - 1]
        bugs.nextBugId = nextBug._id
        bugs.prevBugId = prevBug._id
        return bugs
    })
}