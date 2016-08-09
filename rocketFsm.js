const machina = require('machina');

exports = module.exports = new machina.BehavioralFsm({
  namespace: 'rocket',

  initialize: function initialize(options) {
  },

  initialState: 'ready',

  startEngines(client) {
    this.handle(client, 'startEngines');
  },

  cutEngines(client) {
    this.handle(client, 'cutEngines');
  },

  countdown(client) {
    this.handle(client, 'countdown');
  },

  states: {
    ready: {
      _onEnter(client) {
        client.engine = 'off';
        client.fuel = 20;
        this.emit('enginechanged', { client });
      },
      startEngines(client) {
        this.transition(client, 'igniting');
      },
    },

    igniting: {
      _onEnter(client) {
        client.engine = 'idling';
        this.emit('enginechanged', { client });
      },
      countdown(client) {
        client.count = 10;
        client.timer = setInterval(function () {
          client.count--;
          this.emit('countdownchanged', { client });
          if (client.count === 0) {
            this.transition(client, 'liftoff');
          }
        }.bind(this), 1000);
      },
      _onExit(client) {
        clearInterval(client.timer);
        delete client.timer;
      },
    },

    liftoff: {
      _onEnter(client) {
        client.engine = 'fullburn';
        this.emit('enginechanged', { client });
        
        client.timer = setInterval(function () {
          client.fuel--;
          this.emit('enginechanged', { client });
        }.bind(this), 1000);        
      },

      cutEngines(client) {
        client.engine = 'off';
        this.emit('enginechanged', { client });
        this.transition(client, 'orbiting');
      },

      _onExit(client) {
        clearInterval(client.timer);
        delete client.timer;
      },
    },

    orbiting: {
    },
  },
});
