const schemas = [
  {
    validate: true,
    fileMatch: ['*'],
    schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          pattern: '((/([a-z0-9_-])+)+)(?![A-Z].)*',
        },
        description: {
          type: 'string',
        },
        headers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              uuid: {
                type: 'string',
                uniqueItems: true,
              },
              isActive: {
                type: 'boolean',
              },
              key: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
            },
            propertyNames: {
              enum: ['uuid', 'isActive', 'key', 'value'],
            },
            required: ['uuid', 'isActive', 'key', 'value'],
          },
        },
        methods: {
          type: 'object',
          patternProperties: {
            'GET|POST|PATCH|PUT|DELETE': {
              type: 'object',
              properties: {
                delay: {
                  type: 'number',
                  minimum: 0,
                },
                status: {
                  type: 'number',
                  enum: [200, 304, 400, 401, 403, 405, 408, 500, 501, 505],
                },
              },
              propertyNames: {
                enum: ['delay', 'status'],
              },
              required: ['delay', 'status'],
            },
          },
          propertyNames: {
            enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
          },
        },
        pipeline: {
          type: 'object',
          patternProperties: {
            'GET|POST|PATCH|PUT|DELETE': {
              type: 'object',
              properties: {
                isActive: {
                  type: 'boolean',
                },
                value: {
                  type: 'string',
                },
              },
              propertyNames: {
                enum: ['isActive', 'value'],
              },
              required: ['isActive', 'value'],
            },
          },
          propertyNames: {
            enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
          },
        },
        response: {},
        createdDate: {
          type: 'string',
        },
        updatedDate: {
          type: 'string',
        },
      },
      propertyNames: {
        enum: [
          'path',
          'description',
          'headers',
          'methods',
          'pipeline',
          'response',
          'createdDate',
          'updatedDate',
        ],
      },
      required: ['path'],
    },
  },
];

export default schemas;
