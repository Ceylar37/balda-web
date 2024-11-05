module.exports = {
  api: {
    output: {
      workspace: 'src/api/',
      target: 'requests.ts',
      schemas: '_model',
      // mock: true,
      separateRequests: true,

      override: {
        mutator: {
          path: './instance.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: 'http://localhost:8081/v3/api-docs'
    }
  }
};
