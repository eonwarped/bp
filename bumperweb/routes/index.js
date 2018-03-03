var express = require('express');
const sqlite = require('sqlite');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const sqlGetQueueData = 'SELECT * FROM PendingUpvotes WHERE (Processed is null OR Processed != 1) LIMIT ?';

/* GET pending upvotes. */
router.get('/pending', async function(req, res, next) {

  try {
    var limit = (req.query.n ? req.query.n : 100);
    await sqlite.open(`../db.sqlite`);
    const rows = await sqlite.all(sqlGetQueueData, [limit]);

    res.render('pending', {
      limit: limit,
      values: rows
    });

    /*for (var i=0; i < rows.length; i++) {
      row = rows[i];
      log(row);
      log("");
      log("###########");
      log("User: " + row.Name);
      log("Amount: " + row.Amount);
      log("Blog: " + row.Blog);
      var weight = await voteAndUpdateWeight(prop, voter, row);
      log("Weight to use: " + formatWeight(weight));
      log("Waiting " + argv.w + " seconds...");
      sleep(argv.w*1000);
      values.push(row);
    }*/
  } catch (e) {
    next(e);
  }
});

module.exports = router;
