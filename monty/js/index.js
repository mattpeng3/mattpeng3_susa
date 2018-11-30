var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var seed = function seed(s) {
  return function () {
    s = Math.sin(s) * 10000;return s - Math.floor(s);
  };
};

// usage:
var random1 = seed(Math.random() * 100);
var random2 = seed(random1());
var random = seed(random2());var


Simulator = function (_React$Component) {_inherits(Simulator, _React$Component);

  function Simulator(props) {_classCallCheck(this, Simulator);var _this = _possibleConstructorReturn(this, (Simulator.__proto__ || Object.getPrototypeOf(Simulator)).call(this,
    props));
    _this.state = _this.initialState();return _this;
  }_createClass(Simulator, [{ key: "initialState", value: function initialState(

    sim) {
      return {
        game: {
          selected: -1,
          prize: this.randomize(),
          closed: -1 },

        results: {
          tries: 0,
          prizes: 0 },

        buttons: {
          keep: true,
          change: true },

        stage: "selection",
        simState: {
          isSim: sim,
          stage: "setup",
          decision: "keep" },

        simCount: {
          current: 0,
          total: 1 } };


    } }, { key: "setGameState", value: function setGameState(
    key, val) {
      var gameState = {
        selected: this.state.game.selected,
        prize: this.state.game.prize,
        open: this.state.game.open };


      gameState[key] = val;
      this.setState({ game: gameState });
    } }, { key: "randomize", value: function randomize()

    {
      var p = random() * 3;
      return Math.floor(p);

    } }, { key: "getEmptyDoor", value: function getEmptyDoor(

    selected) {var _this2 = this;
      console.log("selected " + selected + " prize " + this.state.game.prize);
      var doors = [0, 1, 2].filter(function (el) {return el !== selected && el !== _this2.state.game.prize;});

      if (doors.length == 1) {
        return doors[0];
      } else
      {
        console.log(doors);
        return doors[Math.floor(random() * 2)];
      }

    } }, { key: "doorClick", value: function doorClick(

    ev) {
      console.log("door clicked " + ev.target.id);
      var id = ev.target.id.substr("door".length);
      var selected = parseInt(id);
      var empty = this.getEmptyDoor(selected);

      this.setState({ game: { selected: selected,
          prize: this.state.game.prize,
          open: empty },
        stage: "decision" }, function () {ev.cb && ev.cb.call(this);}.bind(this));


    } }, { key: "decisionClick", value: function decisionClick(

    ev) {var _this3 = this;
      var decision = ev.target.id;
      var gameState = {
        open: this.state.game.open,
        prize: this.state.game.prize };

      switch (decision) {
        case "keep":
          gameState.selected = this.state.game.selected;
          break;
        case "change":
          gameState.selected = [0, 1, 2].filter(function (el) {return el != _this3.state.game.selected && el != _this3.state.game.open;})[0];
          break;}

      var correct = this.state.game.prize == gameState.selected;
      var gameResults = {
        tries: this.state.results.tries + 1,
        prizes: this.state.results.prizes + (correct ? 1 : 0) };

      var gameStage = "ended";
      this.setState({
        game: gameState,
        results: gameResults,
        stage: gameStage },
      function () {ev.cb && ev.cb.call(this);});

    } }, { key: "replay", value: function replay(

    ev) {
      var gameState = {
        selected: -1,
        prize: this.randomize(),
        open: -1 };


      this.setState({ game: gameState, stage: "selection" },
      function () {ev.cb && ev.cb.call(this);});
    } }, { key: "reset", value: function reset()

    {
      this.setState(this.initialState());
    } }, { key: "simChange", value: function simChange(

    ev) {
      this.setState({ simState: {
          isSim: this.state.simState.isSim,
          stage: this.state.simState.stage,
          decision: ev.target.value } });

    } }, { key: "validateSim", value: function validateSim(

    ev) {
      console.log(ev.target.value);
      var val = ev.target.value;
      if (val > 300) val = 300;else
      if (val < 1) val = 1;
      this.setState({ simCount: {
          current: this.state.simCount.current,
          total: val } });

    } }, { key: "startSimulation", value: function startSimulation()

    {
      this.setState({
        simState: {
          isSim: true,
          stage: "simulating",
          decision: this.state.simState.decision } },


      function () {
        this.replay({ cb: function () {
            setTimeout(this.simulate.bind(this), 200);
          }.bind(this) });
      }.bind(this));

    } }, { key: "simulate", value: function simulate()

    {

      function reSim() {
        if (this.state.simCount.total > this.state.simCount.current) {
          setTimeout(
          function () {
            this.replay({ cb:
              function () {
                setTimeout(this.simulate.bind(this), 500);
              }.bind(this) });


          }.bind(this), 500);
        } else {
          this.setState({
            simState: {
              isSim: false,
              stage: "setup",
              decision: this.state.simState.decision },

            simCount: {
              total: this.state.simCount.total,
              current: 0 } });


        }
      }
      function decide() {
        this.decisionClick.call(this, {
          target: {
            id: this.state.simState.decision },

          cb: function cb() {
            this.setState({
              simCount: {
                total: this.state.simCount.total,
                current: this.state.simCount.current + 1 } },

            reSim.bind(this));
          } });

      }

      var selection = random() * 3;
      this.doorClick.call(this, {
        target: {
          id: 'door' + selection },

        cb: function () {
          setTimeout(decide.bind(this), 500);
        }.bind(this) });



    } }, { key: "stop", value: function stop()

    {

    } }, { key: "render", value: function render()
    {
      var doors = [0, 1, 2];
      var inSim = this.state.simState.isSim;
      return (
        React.createElement("div", null,

          React.createElement("div", { id: "doors", className: "doors" },

            doors.map(function (child, ind) {
              var selected = ind == this.state.game.selected;
              var covered = ind != this.state.game.open && this.state.stage !== "ended";
              var disabled = this.state.stage !== "selection" || inSim;
              console.log(selected);
              return React.createElement(Door, { id: ind, doorClick: this.doorClick.bind(this), arrow: selected, covered: covered, disable: disabled, isPrize: this.state.game.prize == ind, stage: this.state.stage });
            }.bind(this))),


          React.createElement("div", { className: "btn-container" },
            React.createElement("button", { className: "btn-magic", id: "keep", disabled: this.state.stage !== "decision" || inSim, onClick: this.decisionClick.bind(this) }, "KEEP"),
            React.createElement("button", { className: "btn-magic", id: "change", disabled: this.state.stage !== "decision" || inSim, onClick: this.decisionClick.bind(this) }, "CHANGE")),

          React.createElement("div", { className: "btn-container" },
            React.createElement("button", { className: "btn-magic", id: "reset", onClick: this.reset.bind(this), disabled: inSim }, "RESET"),
            React.createElement("button", { className: "btn-magic", id: "replay", onClick: this.replay.bind(this), disabled: inSim }, "PLAY ON")),





          React.createElement("hr", { className: "stop" }, ),
          React.createElement("div", { className: "hit-the-floor" }, "RESULTS"),
            React.createElement("hr", { className: "stop" }, ),
          React.createElement("div", { className: "hit-the" }, null, React.createElement("span", null, "Tries: "), React.createElement("span", { id: "tries" }, this.state.results.tries)),
          React.createElement("hr", { className: "stop" }, ),
          React.createElement("div", { className: "hit-the" }, null, React.createElement("span", null, "Prizes: "), React.createElement("span", { id: "prizes" }, this.state.results.prizes))));


    } }]);return Simulator;}(React.Component);var

Door = function (_React$Component2) {_inherits(Door, _React$Component2);

  function Door(props) {_classCallCheck(this, Door);return _possibleConstructorReturn(this, (Door.__proto__ || Object.getPrototypeOf(Door)).call(this,
    props));


  }_createClass(Door, [{ key: "doorClick", value: function doorClick(

    ev) {
      console.log("door has be en clicked");
      this.props.doorClick({ target: { id: "door" + this.props.id } });
    } }, { key: "render", value: function render()

    {
      var classes = "door";
      var text = "";
      if (this.props.covered) classes += " covered";
      if (this.props.disable) classes += " disabled";
      if (this.props.arrow) classes += " selected";
      console.log(classes);
      if (this.props.isPrize) text = "Prize!";
      return React.createElement("div", { id: "door" + this.props.id, className: classes + " door_" + (this.props.id + 1), onClick: this.doorClick.bind(this) },
        React.createElement("div", { className: "door-wrap" },
          React.createElement("div", { className: "door-itself" },
            React.createElement("div", { className: "front" },
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "handle" })),

            React.createElement("div", { className: "back" },
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }),
              React.createElement("div", { className: "tile" }))),


          React.createElement("span", { className: "prize " + (this.props.stage == "ended" ? "" : "hide") }, text)));


    } }]);return Door;}(React.Component);



React.render(
React.createElement(Simulator, null), document.getElementById('simulator'));
