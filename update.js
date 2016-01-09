var Firebase = require('firebase');
var ref = new Firebase("https://confreaks.firebaseio.com/videos");
var async = require('async');

// http://confreaks.tv/api/v1/videos.json > videos.json
// `curl http://confreaks.tv/api/v1/videos.json > videos.json`

var videos = require('./videos.json');
console.dir(videos[0]);

async.each(videos, function(video, done){
  video.negative_views = video.views * -1;
  video.negative_views_last_30 = video.views_last_30 * -1;
  video.negative_views_last_7 = video.views_last_7 * -1;

  ref.child(video.id).set(video, function(err){
    console.log(video.id);
    done(err);
  });

}, function(err){
  if(err){
    console.log(err);
    process.exit(1);
  }
  process.exit(0);
});
