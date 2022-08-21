require('dotenv').config();

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');

const { writeFileSync, readFileSync, existsSync } = require('fs');

const SESSEION_FILE_PATH = "./session.json";

async function fakeSave(data) {
  // here you would save it to a file/database etc.
  // you could save it to a file: writeFile(path, JSON.stringify(data))
  await writeFileSync(SESSEION_FILE_PATH, JSON.stringify(data));
  return data;o
}

async function fakeExists() {
  // here you would check if the data exists
  return await existsSync(SESSEION_FILE_PATH);
}

async function fakeLoad() {
  // here you would load the data
  return await readFileSync(SESSEION_FILE_PATH);
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

console.log(timestampToDate());

function timestampToDate(unix_timestamp){
  const date_ = unix_timestamp ? new Date(unix_timestamp * 1000): new Date();
  
  const year = date_.getFullYear();
  const month = months[date_.getMonth()];
  const date = date_.getDate();
  const hours = date_.getHours();
  const minutes = "0" + date_.getMinutes();
  const seconds = "0" + date_.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return time;
}

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  // This function executes after every request
  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize();
    delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
    fakeSave(serialized);
  });
  if (await fakeExists()) {
    // import state accepts both a string as well as an object
    // the string should be a JSON object
    await ig.state.deserialize(fakeLoad());
  }
  // This call will provoke request.end$ stream
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  
  process.env.IG_USER_IDS.split(", ").forEach( async user => {

    const targetUser = await ig.user.searchExact(user);
    const userFeed = ig.feed.user(targetUser.pk);
    //const wholeResponse = await followersFeed.request();
    const items = await userFeed.items();
    
    const firstNPosts = items.slice(0, 5);
    
    console.log(user);
    firstNPosts.forEach(e => console.log(
      timestampToDate(e.caption?.created_at || e.taken_at)
      //+ ": "
      //+ ( e.caption?.text || "" )
      //+ "\n"
      )
    );
    console.log();
  })
  
})();

