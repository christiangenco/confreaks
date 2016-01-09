var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var History = ReactRouter.History;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var h = require('./helpers');

var Rebase = require('re-base');
var base = Rebase.createClass("https://cg-catch-of-the-day.firebaseio.com/")

var Catalyst = require('react-catalyst');

// App
var App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState: function(){
    return {
      fishes: {},
      order: {},
    };
  },
  componentDidMount: function(){
    base.syncState(this.props.params.storeId + "/fishes", {
      context: this,
      state: 'fishes',
    });

    var order = localStorage.getItem('order-' + this.props.params.storeId);
    if(order){
      this.setState({order: JSON.parse(order)});
    }
  },
  componentWillUpdate: function(nextProps, nextState){
    console.log("will update", nextProps, nextState);
    localStorage.setItem("order-" + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addFish: function(fish){
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.fishes['fish-' + timestamp] = fish;
    // tell react what changed so it can selectively re-render the actual DOM, which is way slower than the shadow DOM that react is famous for
    // explicitly do this so you don't trigger a refresh when you know you don't need to
    this.setState({fishes: this.state.fishes});
  },
  removeFish: function(key){
    if(confirm("Are you sure you want to remove this fish?")){
      this.state.fishes[key] = null;
      this.setState({fishes: this.state.fishes});
    }
  },
  addToOrder: function(key){
    this.state.order[key] = (this.state.order[key]+1) || 1;
    this.setState({order: this.state.order});
  },
  removeFromOrder: function(key){
    delete this.state.order[key];
    this.setState({order: this.state.order});
  },
  loadSampleFishes: function(){
    console.log("loading samples");
    this.setState({
      fishes: require('./sample-fishes')
    })
  },
  renderFish: function(key){
    // have to pass key as "index" because "key" isn't available inside Fish
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  },
  render: function(){
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
        <Inventory addFish={this.addFish} removeFish={this.removeFish} loadSampleFishes={this.loadSampleFishes} fishes={this.state.fishes} linkState={this.linkState}  />
      </div>
    )
  }
});

// Fish
var Fish = React.createClass({
  addToOrder: function(){
    // console.log("adding the fish", this.props.index);
    this.props.addToOrder(this.props.index);
  },
  render: function(){
    var details = this.props.details;
    var isAvailable = (details.status === 'available');
    var buttonText = (isAvailable ? 'Add to Order' : 'Sold Out!');

    return (
      <li className="menu-fish">
        <img src={details.image} alt=""/>
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.addToOrder}>{buttonText} </button>
      </li>
    );
  }
});

// Header
var Header = React.createClass({
  render: function(){
    return (
      <header className="top">
        <h1>
          Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the </span>
          </span>
          Day
        </h1>
        <h3 className="tagline">
          <span>{this.props.tagline}</span>
        </h3>
      </header>
    )
  }
});

var AddFishForm = React.createClass({
  createFish : function(e) {
    e.preventDefault();

    // 2. Take the data from the form and create an object
    // TODO: _.map(['name', 'price', 'status', 'desc', 'image'], function(i, e){})
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    }

    // 3. Add the fish to the App State
    this.props.addFish(fish);

    // 4. reset the state of the fish form
    this.refs.fishForm.reset();
  },
  render : function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>

        <button type="button" onClick={this.props.loadSampleFishes}>Load Samples</button>
      </form>
    )
  }
});

// Order
var Order = React.createClass({
  renderOrder: function(key){
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>

    if(!fish){
      return <li key={key}>Sorry, fish no longer available {removeButton}</li>
    }

    return (
      <li key={key}>
        {count}lbs
        {fish.name}
        <span className="price">{h.formatPrice(count * fish.price)}</span>
        {removeButton}
      </li>
    );
  },
  render: function(){
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=>{
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      if(fish && fish.status == 'available'){
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </ul>
      </div>
    )
  }
});

// Inventory
var Inventory = React.createClass({
  renderInventory : function(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>
        <input type="text" valueLink={linkState('fishes.'+ key +'.price')}/>
        <select valueLink={linkState('fishes.' + key + '.status')}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">Fresh!</option>
        </select>

        <textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.'+ key +'.image')}/>
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>

      </div>
    )
  },
  render: function(){
    return (
      <div>
        <h2>Inventory</h2>

        {Object.keys(this.props.fishes).map(this.renderInventory)}

        {/* <AddFishForm addFish={this.addFish}/> */}
        <AddFishForm {...this.props} />
      </div>
    )
  }
});

// StorePicker
var StorePicker = React.createClass({
  mixins: [History],
  goToStore: function(e){
    e.preventDefault();
    // get data from input
    var storeId = this.refs.storeId.value;

    // transition to <App/>
    this.history.pushState(null, '/store/' + storeId);
  },
  render: function(){
    return (
      <form className='store-selector' onSubmit={this.goToStore}>
        <h2>Please Enter a Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
        <input type="Submit"/>
      </form>
    )

  }
})

// Not Found
var NotFound = React.createClass({
  render: function(){
    return <h1>Not Found</h1>
  }
})

// Routes
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'))
