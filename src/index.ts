import { app } from "./settings"
const port = 5000

app.listen(port, () => {
  console.log(`App started on ${port} port`)
})