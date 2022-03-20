//DB ORM

import { db } from "./db.js";

//insert data to db
export async function writeData(data){
	//console.log(data)
	const sql = `INSERT INTO sensorData(uid, time, temperature, pressure, altitude, humidity)\
VALUES(${data.uid}, ${data.time}, ${data.temperature}, ${data.pressure}, ${data.altitude}, ${data.humidity})`
	console.log(sql)
	await db.query(sql)
}






