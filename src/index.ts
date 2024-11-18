import { app } from "./settings";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`HO1API-V1 app listening on port ${port}`);
});
