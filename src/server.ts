import app from "./app";

// @ts-ignore
const port: number = +process.env.PORT ?? 8000;

app.listen(port, () => console.info(`Server up and running on port ${port}`));
