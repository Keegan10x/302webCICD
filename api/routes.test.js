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
		body: JSON.stringify(await Deno.readTextFile("/home/codio/workspace/api/testData.txt"))
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
  //const response = await fetch('/api/v1/data', options)
  //const result = await response.json()
  const rsp = await fetch("https://respect-marco-8080.codio-box.uk/api/v1/data", getOptions)
  const result = await rsp.json()
  //console.log("logging result:", result)
  let hasData = false
  //console.log("logging array length:", result.data.time.length)
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
