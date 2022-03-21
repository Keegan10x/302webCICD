import { assertEquals, fail, assertThrows } from 'https://deno.land/std@0.79.0/testing/asserts.ts';
import { db } from "./modules/db.js";

const getOptions = {
	method: "GET",
	headers: {
		"Content-Type": "application/vnd.api+json"
		}
	}

const postBadOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Authorization': 'Basic ZG9lajpwNDU1dzByZA=='
		},
		body: ''
	}


const postGoodOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Authorization': 'Basic ZG9lajpwNDU1dzByZA=='
		},
		//body: JSON.stringify(await Deno.readTextFile("/home/codio/workspace/api/testData.txt"))
		body: JSON.stringify("data:@file/vnd.ms-excel;base64,PX49fj1+PX49fj1+PX49fj1+PX49fj0gUHVUVFkgbG9nIDIwMjIuMDIuMDkgMTM6MjE6MjMgPX49fj1+PX49fj1+PX49fj1+PX49fj0KCjkxOTIsICAyMS4zLCAxMDExLjYsICAxMy45LCAgNDkuNAoKMTExOTgsICAyMS4zLCAxMDExLjYsICAxMy45LCAgNDkuNAoKMTMyMDQsICAyMS4zLCAxMDExLjYsICAxMy45LCAgNDkuNQoKMTUyMTEsICAyMS4zLCAxMDExLjYsICAxMy44LCAgNDkuNQoKMTcyMTcsICAyMS4zLCAxMDExLjYsICAxMy43LCAgNDkuNQoKMTkyMjMsICAyMS4zLCAxMDExLjYsICAxMy45LCAgNDkuNAoKMjEyMzAsICAyMS40LCAxMDExLjYsICAxMy45LCAgNDkuNgoKMjMyMzYsICAyMS40LCAxMDExLjYsICAxNC4wLCAgNDkuNwoKMjUyNDIsICAyMS41LCAxMDExLjYsICAxMy44LCAgNDkuOAoKMjcyNDgsICAyMS41LCAxMDExLjYsICAxNC4wLCAgNTAuMAoKMjkyNTUsICAyMS42LCAxMDExLjYsICAxMy44LCAgNDkuOAoKMzEyNjIsICAyMS41LCAxMDExLjYsICAxMy45LCAgNDkuOQoKMzMyNjgsICAyMS42LCAxMDExLjYsICAxNC4wLCAgNTIuMQoKMzUyNzUsICAyMS42LCAxMDExLjYsICAxNC4xLCAgNTAuMQoKMzcyODEsICAyMS42LCAxMDExLjYsICAxMy44LCAgNTAuMQoKMzkyODgsICAyMS42LCAxMDExLjYsICAxNC4wLCAgNDkuOQoKNDEyOTQsICAyMS42LCAxMDExLjYsICAxMy44LCAgNDkuNwoKNDMzMDAsICAyMS43LCAxMDExLjUsICAxNC4zLCAgNDkuOAoKNDUzMDcsICAyMS43LCAxMDExLjYsICAxMy45LCAgNDkuNQoKNDczMTQsICAyMS43LCAxMDExLjYsICAxNC4wLCAgNDkuMwoKNDkzMjAsICAyMS44LCAxMDExLjYsICAxMy44LCAgNDkuMQoKNTEzMjcsICAyMS44LCAxMDExLjYsICAxMy44LCAgNDkuMQoKNTMzMzMsICAyMS44LCAxMDExLjYsICAxMy43LCAgNDkuMAoKNTUzMzksICAyMS44LCAxMDExLjYsICAxMy45LCAgNDguNwoKNTczNDYsICAyMS44LCAxMDExLjYsICAxNC4xLCAgNDguNwoKNTkzNTMsICAyMS44LCAxMDExLjYsICAxNC4wLCAgNDguNgoKNjEzNTksICAyMS44LCAxMDExLjYsICAxMy45LCAgNDguOAoKNjMzNjUsICAyMS44LCAxMDExLjUsICAxNC4zLCAgNDguOAoKNjUzNzIsICAyMS44LCAxMDExLjYsICAxNC4wLCAgNDguOAoKNjczNzgsICAyMS44LCAxMDExLjYsICAxMy45LCAgNDguNwoKNjkzODQsICAyMS44LCAxMDExLjYsICAxNC4xLCAgNDguNgoKNzEzOTAsICAyMS44LCAxMDExLjYsICAxNC4xLCAgNDguNgoKNzMzOTcsICAyMS45LCAxMDExLjYsICAxMy44LCAgNDguNAoKNzU0MDMsICAyMS45LCAxMDExLjYsICAxMy44LCAgNDguMgoKNzc0MTAsICAyMS45LCAxMDExLjYsICAxMy43LCAgNDguMQoKNzk0MTYsICAyMS45LCAxMDExLjYsICAxMy45LCAgNDguMwoKODE0MjIsICAyMS45LCAxMDExLjYsICAxMy44LCAgNDguNAoKODM0MjksICAyMS45LCAxMDExLjYsICAxMy44LCAgNDguMAoKODU0MzUsICAyMi4yLCAxMDExLjYsICAxNC4xLCAgNTMuOAoKODc0NDIsICAyMi4yLCAxMDExLjYsICAxNC4wLCAgNTEuMQoKODk0NDgsICAyMi40LCAxMDExLjYsICAxNC4wLCAgNTQuOQoKOTE0NTUsICAyMi41LCAxMDExLjYsICAxNC4wLCAgNTUuMwoKOTM0NjEsICAyMi42LCAxMDExLjYsICAxNC4xLCAgNTQuNQoKOTU0NjcsICAyMi41LCAxMDExLjUsICAxNC4yLCAgNTEuMgoKOTc0NzMsICAyMi41LCAxMDExLjUsICAxNC40LCAgNTAuMAoKOTk0ODAsICAyMi41LCAxMDExLjUsICAxNC40LCAgNTAuMAoKMTAxNDg2LCAgMjIuNSwgMTAxMS41LCAgMTQuMywgIDQ5LjAKCjEwMzQ5MywgIDIyLjQsIDEwMTEuNSwgIDE0LjMsICA0OC44CgoxMDU0OTksICAyMi40LCAxMDExLjUsICAxNC40LCAgNDguMgoKMTA3NTA2LCAgMjIuNCwgMTAxMS42LCAgMTQuMSwgIDQ3LjcKCjEwOTUxMiwgIDIyLjQsIDEwMTEuNiwgIDE0LjIsICA0Ny44CgoxMTE1MTksICAyMi40LCAxMDExLjUsICAxNC4zLCAgNDcuOAoKMTEzNTI1LCAgMjIuNCwgMTAxMS42LCAgMTMuNSwgIDUwLjQKCjExNTUzMSwgIDIyLjUsIDEwMTEuNSwgIDE0LjYsICA1NC40CgoxMTc1MzgsICAyMi42LCAxMDExLjQsICAxNS41LCAgNTUuMwoKMTE5NTQ0LCAgMjIuNywgMTAxMS41LCAgMTQuMywgIDU0LjMKCjEyMTU1MSwgIDIyLjcsIDEwMTEuNSwgIDE0LjQsICA1MC4yCgoxMjM1NTgsICAyMi43LCAxMDExLjUsICAxNC40LCAgNDkuMwoKMTI1NTY0LCAgMjIuNiwgMTAxMS41LCAgMTQuNSwgIDQ5LjAKCjEyNzU3MSwgIDIyLjYsIDEwMTEuNSwgIDE0LjQsICA0OC42CgoxMjk1NzcsICAyMi42LCAxMDExLjUsICAxNC40LCAgNDguNgoKMTMxNTg0LCAgMjIuNiwgMTAxMS41LCAgMTQuMywgIDQ4LjMKCjEzMzU5MCwgIDIyLjYsIDEwMTEuNSwgIDE0LjMsICA0OC4xCgoxMzU1OTcsICAyMi41LCAxMDExLjYsICAxNC4wLCAgNDcuOAoKMTM3NjAzLCAgMjIuNSwgMTAxMS42LCAgMTQuMSwgIDQ3LjYKCjEzOTYwOSwgIDIyLjUsIDEwMTEuNiwgIDE0LjAsICA0Ny41CgoxNDE2MTYsICAyMi41LCAxMDExLjUsICAxNC4zLCAgNDcuNQoKMTQzNjIzLCAgMjIuNSwgMTAxMS42LCAgMTQuMCwgIDQ3LjYKCjE0NTYyOSwgIDIyLjQsIDEwMTEuNSwgIDE0LjIsICA0Ny42CgoxNDc2MzUsICAyMi40LCAxMDExLjUsICAxNC4yLCAgNDcuNQoKMTQ5NjQxLCAgMjIuNCwgMTAxMS41LCAgMTQuNCwgIDQ3LjUKCjE1MTY0OCwgIDIyLjQsIDEwMTEuNSwgIDE0LjUsICA0Ny42CgoxNTM2NTQsICAyMi40LCAxMDExLjUsICAxNC4yLCAgNDcuNwoKMTU1NjYwLCAgMjIuNCwgMTAxMS42LCAgMTQuMiwgIDQ3LjgKCjE1NzY2NiwgIDIyLjMsIDEwMTEuNSwgIDE0LjQsICA0Ny45CgoxNTk2NzMsICAyMi4zLCAxMDExLjUsICAxNC40LCAgNDcuOAoKMTYxNjc5LCAgMjIuMywgMTAxMS41LCAgMTQuMiwgIDQ3LjgKCjE=")
	}

const noAuthOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/vnd.api+json',
			'Authorization': ''
		},
		body: ''
	}

const goodLogin = {
	method: "GET",
	headers: {
		"Content-Type": "application/vnd.api+json",
		'Authorization': 'Basic ZG9lajpwNDU1dzByZA=='
		}
	}

const badLogin = {
	method: "GET",
	headers: {
		"Content-Type": "application/vnd.api+json",
		'Authorization': ''
		}
	}

const goodRegister = {
		method: 'POST',
		headers: { 'Content-Type': 'application/vnd.api+json' },
		body: JSON.stringify({
			'user':'testbob',
			'pass':'testbob123'
		})
	}

const badRegister = {
		method: 'POST',
		headers: { 'Content-Type': 'application/vnd.api+json' },
		body: JSON.stringify({
			'user':'',
			'pass':'3'
		})
	}

const goodCloseAccount = {
		method: 'POST',
		headers: {
			"Content-Type": "application/vnd.api+json",
			'Authorization': 'Basic ZG9lajpwNDU1dzByZA=='
		},
		body: JSON.stringify({
			"user":"testbob",
  			"pass":"testbob123"
		})
	}

const badCloseAccount = {
		method: 'POST',
		headers: {
			"Content-Type": "application/vnd.api+json",
			'Authorization': 'Basic ZG9lajpwNDU1dzByZA=='
		},
		body: JSON.stringify({
			"user":"uknownwrongjimmy",
  			"pass":"thisisacompletelyincorrectpassword"
		})
	}


//Getting Data
Deno.test('Getting Sensor Data', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/data", getOptions)
  const result = await rsp.json()
  let hasData = false
  if(result.data.time.length > 0) hasData = true
  assertEquals(hasData, true, 'Got no sensor data')
})



//Posting Bad Data
Deno.test('Posting Bad Data', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/files", postBadOptions)
  const result = await rsp.json()
  assertEquals(result.errors[0].title, 'a problem occurred', 'Error message not showing')
})

//Posting Good Data
Deno.test('Posting Good Data', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/files", postGoodOptions)
  const result = await rsp.json()
  assertEquals(result.data.message, 'file uploaded', 'File failed to upload')
})

//Posting With No Authorization Headers
Deno.test('Posting With No Auth Header', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/files", noAuthOptions)
  const result = await rsp.json()
  assertEquals(result.errors[0].title, '401 Unauthorized!', 'Failed authorization')
})


//Test Login
Deno.test('Good Login', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/accounts", goodLogin)
  const result = await rsp.json()
  assertEquals(result.data, 'doej', 'Login failed')
})

Deno.test('Bad Login', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/accounts", badLogin)
  const result = await rsp.json()
  assertEquals(result.errors[0].title, '401 Unauthorized!', 'Problem with error message')
})


//Test Register
Deno.test('Good Register', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/accounts", goodRegister)
  const result = await rsp.json()
  assertEquals(result.response, 'Account created', 'Account cration failed')
})

Deno.test('Bad Register', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/accounts", badRegister)
  const result = await rsp.json()
  assertEquals(result.response, 'Couldnt create account', 'Problem with register error message')
})


//Close Account
Deno.test('Good Close Account', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/leavers", goodCloseAccount)
  const result = await rsp.json()
  assertEquals(result.response, 'Account Closed', 'Account wasnt closed')
})


Deno.test('Bad Close Account', async () => {
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/leavers", badCloseAccount)
  const result = await rsp.json()
  assertEquals(result.response, 'Couldnt Close Account', 'Problem with error message')
})
