require('dotenv').config();

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  // console.log(JSON.stringify(auth));

  process.env.IG_USER_IDS.split(", ").forEach( async user => {

  	// getting exact user by login
    const targetUser = await ig.user.searchExact(user);

	// working with reels media feed (stories feed)
    const reelsFeed = ig.feed.reelsMedia({
      userIds: [targetUser.pk], // you can specify multiple user id's, "pk" param is user id
    });
    // getting reels, see "account-followers.feed.example.ts" if you want to know how to work with feeds
    const storyItems = await reelsFeed.items();
    
    // we can check items length and find out if the user does have any story to watch
    console.log(`${targetUser.username.padEnd(20)} story has ${storyItems.length} items`);

  })
  
})();

