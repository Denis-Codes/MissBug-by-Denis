import fs from 'fs'

import { utilService } from "./util.service.js"
import { loggerService } from './logger.service.js'


export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 3
const bugs = utilService.readJsonFile('data/bugs.json')

function query(filterBy = {}) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }

            // Sorting
            if (filterBy.sortBy) {
                const sortDir = filterBy.sortDir === '-1' ? -1 : 1
                bugs.sort((a, b) => {
                    if (a[filterBy.sortBy] > b[filterBy.sortBy]) return sortDir
                    if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -sortDir
                    return 0
                })
            }

            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE // 0 , 3
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }

            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)

    const bug = bugs[idx]
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile().then(() => `bug (${bugId}) removed!`)
}


function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}