const fs = require('fs')
const path = require('path')

const folders = [
  'src/domain/entities',
  'src/domain/repositories',
  'src/domain/services',

  'src/application/use-cases',
  'src/application/dtos',
  'src/application/gateways',

  'src/infrastructure/database/postgres',
  'src/infrastructure/http/controllers',
  'src/infrastructure/http/routes',
  'src/infrastructure/http/middlewares',
  'src/infrastructure/gateways',

  'src/main',

  'src/tests/unit',
  'src/tests/integration'
]

folders.forEach(folder => {
  fs.mkdirSync(path.resolve(folder), { recursive: true })
})

fs.writeFileSync('src/main/app.ts', '')
fs.writeFileSync('src/main/server.ts', '')

console.log('✅ Clean Architecture structure created!')
