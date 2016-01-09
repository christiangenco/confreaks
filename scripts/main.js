var React = require('react');
var ReactDOM = require('react-dom');

var Firebase = require('firebase');
window.ReactFire = require('reactfire');

var h = require('./helpers');
var moment = require('moment');
var $ = require('jquery');

var App = React.createClass({
  // mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      videos: [],
      limit: 2,
      pageSize: 1
    };
  },
  componentWillMount: function(){
    var ref = new Firebase("https://confreaks.firebaseio.com/videos");
    // this.bindAsArray(ref, "videos");

    ref.on("child_added", function(dataSnapshot) {
      console.dir(dataSnapshot);
      this.state.videos.push(dataSnapshot.val());
      this.setState({
        videos: this.state.videos
      });
    }.bind(this));
    // this.unbind("videos")
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
