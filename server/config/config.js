//this file is omitted from git for security
// env variable is for setting environment variables which are different for development, test and production
// env or process.env.NODE_ENV is set to production here by default or is set to test from package.json when testing or is set to production by heroku
// if process.env.NODE_ENV is production then this code will not run and other environment variables will be set by heroku

let env = process.env.NODE_ENV || 'development';

console.log('/////env var je:', env);

//this does not run in production
if (env === 'development' || env === 'test') {
  
  // when requiring JSON file, it is automatically parsed to object, bracket notation config[env] is equal to config.development or config.test depending on value of env variable (set by heroku or package.json)
  //envConfig is object object with local environment values for particular environment (based on env variable) => envConfig is test or development object according to env var
  let config = require('./config.json');
  let envConfig = config[env];
// console.log('nastaveni envira probehlo');

  
  //Object.keys() returns array of property names of the passed object, then for each loops through that array and assings local environment variables...
  //..like proces.env.PORT = envConfig.PORT
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}






