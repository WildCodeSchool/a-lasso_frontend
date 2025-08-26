import { defineConfig } from 'cypress'

export default defineConfig({
  
  e2e: {
    // 'baseUrl': 'http://localhost:4200'
    'baseUrl': 'http://alasso-staging:80'
  },
  
  
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }
  
})