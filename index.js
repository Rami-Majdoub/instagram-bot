require('dotenv').config();

const { IgApiClient } = require('instagram-private-api');

const { sessionSave, sessionExists, sessionLoad } = require("./sessionUtils");
const { timestampToDate } = require("./utils");

console.log(" ".repeat(28) + timestampToDate());

async function getInfos(ig, user){
  const targetUser = await ig.user.searchExact(user);

  // stories
  const reelsFeed = ig.feed.reelsMedia({
    userIds: [targetUser.pk],
  });
  const storyItems = await reelsFeed.items();
    
  // feed
  const userFeed = ig.feed.user(targetUser.pk);
  let item0 = null;
  try{
    item0 = (await userFeed.items())[0];
  } catch(e) {
  }
  const item0date = item0 ? timestampToDate(item0?.caption?.created_at || item0?.taken_at): "Not authorized to view user";

  console.log(`${user.padEnd(15)} | ${storyItems.length} story | ${item0date}`);
}

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  // This function executes after every request
  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize();
    delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
    sessionSave(serialized);
  });
  if (await sessionExists()) {
    // import state accepts both a string as well as an object
    // the string should be a JSON object
    await ig.state.deserialize(sessionLoad());
  }
  // This call will provoke request.end$ stream
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  
  const users = process.env.IG_USER_IDS.replaceAll(" ", "").split(",");
  for(let i = 0; i < users.length; i++){
    const user = users[i];
  	await getInfos(ig, user);
  }
  /*
  process.env.IG_USER_IDS.replaceAll(" ", "").split(",").forEach( async (user) => {
  	await getInfos(ig, user);
  })
  */
  
})();

