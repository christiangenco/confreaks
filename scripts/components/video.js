import React from 'react';
var moment = require('moment');

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

export default Video;
