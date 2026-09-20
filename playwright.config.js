import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser', fullyParallel:true, workers:2, reporter:'list',
  use:{baseURL:'http://127.0.0.1:3198',trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{viewport:{width:1360,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
  webServer:{command:'node server.js',url:'http://127.0.0.1:3198',env:{PORT:'3198',TYPESAFE_API_KEY:'',OPENAI_API_KEY:''},reuseExistingServer:false,timeout:15000}
});
