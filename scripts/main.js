var React = require('react');
var ReactDOM = require('react-dom');
// var ReactRouter = require('react-router');
// var Router = ReactRouter.Router;
// var History = ReactRouter.History;
// var Route = ReactRouter.Route;
// var Navigation = ReactRouter.Navigation;
// var createBrowserHistory = require('history/lib/createBrowserHistory');

var Parse = require('parse');
Parse.initialize("OJhdiH9cxLCnKdVCwv6h4xNKzNmnUWlU9Fe4D8iH", "OJONxdXl2il4unpr9rul1F2VEfKvOk3ZXJ1jhWdg");
var ParseReact = require('parse-react');
var h = require('./helpers');
var moment = require('moment');
var $ = require('jquery');

// var Catalyst = require('react-catalyst');

var App = React.createClass({
  // mixins: [Catalyst.LinkedStateMixin],
  mixins: [ParseReact.Mixin],
  getInitialState: function(){
    return {
      videos: [],
      limit: 2,
      pageSize: 1
    };
  },
  observe: function(){
    return {
      videos: (new Parse.Query('video')).ascending('createdAt')
    }
  },
  handleActiveChange: function(doc, index){
    console.log("handling active change");
  },

  // componentDidMount: function() {
  //   this.loadSampleVideos()
  // },
  loadSampleVideos: function(){
    console.log("loading samples");
    this.setState({
      videos: require('./sample-videos')
    })
  },
  render: function(){
    return (
      <div className="">
        {this.data.videos.map(function(video){
          return <Video key={video.id} {...video} />
        })}
      </div>
    )
  }
});

var Video = React.createClass({
  author: function(){
    if(!this.props.presenters) return "";
    return this.props.presenters.map(function(presenter){
      return presenter.first_name + " " + presenter.last_name;
    });
  },
  timeAgo: function(){
    return moment(this.props.post_date).fromNow();
  },
  render: function(){
    return (
      <div className="media">
        <div className="media-left">
          <a href={"http://confreaks.tv/videos/" + this.props.slug} target="_blank">
            <img className="media-object img-thumbnail" src={this.props.image} alt={this.props.title} width="200px" />
          </a>
        </div>
        <div className="media-body">
          <a href={"http://confreaks.tv/videos/" + this.props.slug} target="_blank">
            <h4 className="media-heading">
              {this.props.title}
              <span className="badge pull-right">{this.props.views} views</span>
            </h4>
          </a>
          <h4>
            <small>By {this.author()} at {this.props.event} {this.timeAgo()}</small>
          </h4>
          {this.props.abstract}
        </div>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.querySelector('#main'))
