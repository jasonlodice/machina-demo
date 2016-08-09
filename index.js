const rocketFsm = require('./rocketFsm');

rocketFsm.on('transition', data => {
  console.log(`transition ${data.fromState}->${data.toState}`);
});

rocketFsm.on('handled', data => {
  console.log(`handled ${data.inputType}`);
});

rocketFsm.on('nohandler', data => {
  console.log(`no handler for ${data.inputType} in state ${data.client.__machina__.rocket.state}`);
});

rocketFsm.on('countdownchanged', data => {
  console.log('countdown: ', data.client.count);
});

rocketFsm.on('enginechanged', data => {
  console.log(`engine: ${data.client.engine}, fuel: ${data.client.fuel}`);
});

const ctx = {};

rocketFsm.startEngines(ctx);
rocketFsm.countdown(ctx);
rocketFsm.on('enginechanged', data => {
  if (data.client.engine === 'fullburn' && data.client.fuel < 3) {
    rocketFsm.cutEngines(ctx);
  }
});
