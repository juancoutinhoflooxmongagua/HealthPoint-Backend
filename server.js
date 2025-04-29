const app = require('./src/App')

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
