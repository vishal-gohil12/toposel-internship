import express, { Request, Response } from "express";
import { userRoute } from "./route/userRoute";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // req. body parser
app.use('/', userRoute); //user route 

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});
  
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
  