const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

// LgHOXlzXuZeSNcEV
// alamin11132

const uri =
	"mongodb+srv://alamin11132:LgHOXlzXuZeSNcEV@atlascluster.8trrhzs.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		//  Database server
		const database = client.db("usersDB");
		const usersCollections = database.collection("users");
		// get
		app.get("/users", async (req, res) => {
			const cursor = usersCollections.find();
			const result = await cursor.toArray();
			res.send(result);
		});
		// get

		app.get("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const user = await usersCollections.findOne(query);
			res.send(user);
		});

		//  post
		app.post("/users", async (req, res) => {
			const user = req.body;
			console.log("new user", user);

			const result = await usersCollections.insertOne(user);
			res.send(result);
		});

		// Put

		app.put("/users/:id", async (req, res) => {
			const id = req.params.id;
			const user = req.body;
			console.log(id, user);

			// server side

			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updatedUser = {
				$set: {
					name: user.name,
					email: user.email,
				},
			};
			const result = await usersCollections.updateOne(
				filter,
				updatedUser,
				options
			);
			res.send(result);
		});

		// delete
		app.delete("/users/:id", async (req, res) => {
			const id = req.params.id;
			console.log("please delete from database", id);
			// delete server
			const query = { _id: new ObjectId(id) };
			const result = await usersCollections.deleteOne(query);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("simple code is running on");
});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
