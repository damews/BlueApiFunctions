const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://bluedb:bluedbpassword@cluster0test-94vvs.azure.mongodb.net/IBLUEIT?retryWrites=true&w=majority';

MongoClient.connect(url, (err, db) => {
  if (err) throw err;
  db.plataformoverview.aggregate(
    [
      {
        $project:
                {
                  created_at:
                    {
                      $dateToString:
                        {
                          format: '%Y-%m-%d', date: '$created_at',
                        },
                    },
                  pacientId: 1,
                  playStart: 1,
                  flowDataDevicesId: 1,
                },
      },
      {
        $lookup:
                {
                  from: 'flowdatadevices',
                  let: { flowDataDeviceId: '$flowDataDevicesId' },
                  localField: '',
                  pipeline: [
                    {
                      $match:
                            {
                              $expr: { $eq: ['$_id', '$$flowDataDeviceId'] },
                            },
                    },
                    { $project: { flowDataDevices: 1 } },
                  ],
                  as: 'flowData',
                },
      },
    ],
  ).toArray((err, result) => {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
