$ = require('./jquery-1.11.3.min.js');

ipc = require('ipc');

ipc.on('showBucketList', function(buckets) {
  buckets.forEach(function(bucket) {
    var button_element = $("<div class='bucket-button'>" + bucket["title"] + "</div>");
    $(".bucket-list").append(button_element);
    button_element.click(function() {
      ipc.send('bucket-clicked', bucket["bucket_id"]);
    });
  });
});
