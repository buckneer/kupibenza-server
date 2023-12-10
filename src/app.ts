
import express from 'express';
import "dotenv/config"
import cors from "cors"
import log, { errorHandler, requestLogger, unknownEndpoint } from "./logger";
import connectDB from "./db/connect";
import routes from "./routes";


const app = express();

const PORT = process.env.PORT || 1337;

app.use(cors({
	origin: process.env.ORIGIN,
	credentials: true // Enable sending credentials (like cookies) with the request
  }));
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(requestLogger);


routes(app)

// Remove this if errors:
app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(PORT, () => {
	log.info(`Server running on port: ${PORT}`)
	connectDB();
	
})


