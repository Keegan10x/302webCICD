/* UploadCsv.js */

import { customiseNavbar, file2DataURI, loadPage, secureGet, showMessage } from '../util.js'

export async function setup(node) {
	console.log('uploadCsv: setup')
	try {
		console.log(node)
		customiseNavbar(['home', 'logout',])
		if(localStorage.getItem('authorization') === null) loadPage('login')
		// there is a token in localstorage
		node.querySelector('form').addEventListener('submit', await uploadData)
	} catch(err) {
		console.error(err)
	}
}

async function uploadData(event) {
	console.log('func UPLOAD DATA')
	event.preventDefault()
	const element = document.querySelector('input[name="file"]')
	console.log(element)
	const file = document.querySelector('input[name="file"]').files[0]
	file.base64 = await file2DataURI(file)
	file.user = localStorage.getItem('username')
	console.log(file)
	const url = '/api/v1/files'
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Authorization': localStorage.getItem('authorization')
		},
		body: JSON.stringify(file)
	}
	const response = await fetch(url, options)
	console.log(response)
	const json = await response.json()
	console.log(json)
	showMessage('file uploaded')
	loadPage('home')
}