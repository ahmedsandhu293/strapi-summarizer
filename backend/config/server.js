/* module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
 */

module.exports = ({ env }) => ({
  host: env('HOST', 'localhost'),
  port: env.int('PORT', 1337),
  app: {
    keys: [
      'aaa9736b2e1f560cd80fbfff8fa27cb7ae4366ed2c5a7145834c262630d7751fb898c4c50b878a5fabb4e2e048b79ffad4e356aa46e1e73263d02ee4109ec3324b3abf2f1cfb03d4c0f1664667ac370e7b2ad20c10ce5fa0dae2886a3b423782f8cc8fe3312c9691358a3654fdd6febdd75b4215c7f66f4adf70c48f11a41834',
      '21fab8c116d6479cfe6b4830ad08fdd1cb16d9c8ea6778aabcd8e748486d55b4b22fa022305e40a3e531d362dd939af8837e8204b774f70feade33576b9dea96f5b787942b1f6dd92b2dcaf05a4bb9a8be818046db0150d54fcaddd3e4bcb7087ed66b997016a5f641cfdcde4b08a6b4db17624a083fba6932a34d9f34088252'
    ],
  },
});
