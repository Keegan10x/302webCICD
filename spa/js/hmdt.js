/* UploadCsv.js */

import { customiseNavbar, file2DataURI, loadPage, secureGet, showMessage, loadData, displayData } from '../util.js'

export async function setup(node) {
	console.log('uploadCsv: setup')
	try {
		console.log(node)
		customiseNavbar(['home', 'login', 'register'])
		if(localStorage.getItem('authorization'))customiseNavbar(['home', 'logout',])
		// there is a token in localstorage
		const array = await loadData('humidity', `/api/v1/data`)
		console.log(array)
		displayData(array, node, 'template#hmdt', 'Humidity')
	} catch(err) {
		console.error(err)
	}
}

