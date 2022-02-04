require("dotenv").config()
const express = require("express")
const app = express()
const fs = require("fs")
const port = process.env.PORT || 8080
const mongoose = require("mongoose")

;(async function () {
	try {
		const db = await mongoose.connect(
			process.env.MONGO_DB_URI || "mongodb://localhost:27017/test",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		)
	} catch (error) {
		console.error(error)
	}
})()

const randoSchema = new mongoose.Schema({
	name: String,
})
const Rando = mongoose.model("Rando", randoSchema)

app.get("/test", function (req, res) {
	res.send("the REST endpoint test run!")
})

app.get("/", async function (req, res) {
	try {
		randomStrings = await Rando.find({})
		let suffix = "<br/><br/>"
		randomStrings.forEach((str, idx) => {
			suffix += idx + 1 + ". " + str.name + "<br/>"
		})

		let html = fs.readFileSync("index.html")
		res.write(html + suffix)
		res.status(200)
		res.end()
	} catch (error) {
		console.error(error)
		res.status(500).send(error)
	}
})


app.get("/add-random/", async function (req, res) {
	try {
		let random = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "")
		await Rando.create({ name: random })
		res.redirect("/")
	} catch (error) {
		console.error(error)
		res.status("500").send(error)
	}
})

app.listen(port, function () {
	console.log("Server running at http://127.0.0.1:" + port)
})
