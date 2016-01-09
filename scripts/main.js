var React = require('react');
var ReactDOM = require('react-dom');
// var ReactRouter = require('react-router');
// var Router = ReactRouter.Router;
// var History = ReactRouter.History;
// var Route = ReactRouter.Route;
// var Navigation = ReactRouter.Navigation;
// var createBrowserHistory = require('history/lib/createBrowserHistory');
var h = require('./helpers');
var moment = require('moment');
var $ = require('jquery');

// var Catalyst = require('react-catalyst');

var App = React.createClass({
  // mixins: [Catalyst.LinkedStateMixin],
  getInitialState: function(){
    return {
      videos: [],
      limit: 2,
      pageSize: 1
    };
  },
  componentDidMount: function() {
    var url = "http://confreaks.tv/api/v1/videos.json?limit=" + this.props.limit;
    // $.get(this.props.source, function(result) {
    //   var lastGist = result[0];
    //   if (this.isMounted()) {
    //     this.setState({
    //       username: lastGist.owner.login,
    //       lastGistUrl: lastGist.html_url
    //     });
    //   }
    // }.bind(this));
    this.loadSampleVideos()
  },
  loadSampleVideos: function(){
    console.log("loading samples");
    this.setState({
      videos: require('./sample-videos')
    })
  },
  render: function(){
    return (
      <div className="">
        {this.state.videos.map(function(video){
          return <Video key={video.id} {...video} />
        })}
      </div>
    )
  }
});

var Video = React.createClass({
  author: function(){
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
            <img className="media-object img-thumbnail" src={this.props.image} alt="{this.props.title} at {this.props.event}" width="200px" />
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
