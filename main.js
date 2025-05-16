const path = require("path");
const express = require("express");
const app = express();
const portNumber = 3000;

const gameRoutes = require("./gameRoutes");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "pages"));
app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static('public'));
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
app.use("/", gameRoutes);


console.log(`Web server is running at http://localhost:${portNumber}`);
console.log("Type stop to shutdown the server: ");
process.stdin.setEncoding("utf8");
process.stdin.on('readable', () => {
	const dataInput = process.stdin.read();
	if (dataInput !== null) {
		const command = dataInput.trim();
		if (command === "stop") {
			process.stdout.write("Shutting down the server"); 
			process.exit(0); 
		}
		process.stdin.resume(); 
	}
});

app.listen(portNumber);


