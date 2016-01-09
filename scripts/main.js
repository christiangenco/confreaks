var React = require('react');
var ReactDOM = require('react-dom');

var Firebase = require('firebase');
window.ReactFire = require('reactfire');
var fbutil = require('firebase-util');

var h = require('./helpers');
var moment = require('moment');
var $ = require('jquery');
var Mousetrap = require('mousetrap')
var Loader = require('react-loader');

// http://getbootstrap.com/components/#pagination
var Pagination = require('react-bootstrap').Pagination

var App = React.createClass({
  // mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      videos: [],
      pageSize: 10,
      page: 1,
      pageCount: 0
    };
  },
  componentWillMount: function(){
    var ref = new Firebase("https://confreaks.firebaseio.com/videos");
    // this.firebaseCursor = new Firebase.util.Scroll(ref, 'views');
    this.firebaseCursor = new Firebase.util.Paginate(ref, 'negative_views', {
      pageSize: this.state.pageSize
    });

    this.firebaseCursor.on("child_added", function(dataSnapshot) {
      // console.dir(dataSnapshot);
      this.state.videos.push(dataSnapshot.val());
      this.setState({
        videos: this.state.videos
      });
    }.bind(this));

    // NOTE: this function is misspelled. Change to getCountByDownloadingAllKeys
    // when https://github.com/firebase/firebase-util/pull/82 is merged
    this.firebaseCursor.page.getCountByDowloadingAllKeys(function(count){
      console.info("downloaded total count = ", count)
      this.gotoPage(this.state.page);
    }.bind(this))

    this.firebaseCursor.page.onPageCount(function(currentPageCount, couldHaveMore) {
      this.setState({
        pageCount: currentPageCount
      });
    }.bind(this));

    this.firebaseCursor.page.onPageChange(function(pageNumber){
      // ignore initial loading
      if(pageNumber !== 0){
        console.info("on page " + pageNumber);
        this.setState({
          page: pageNumber
        });
      }
    }.bind(this));
  },
  componentDidMount: function(){
    Mousetrap.bind('right', function() { this.nextPage() }.bind(this));
    Mousetrap.bind('left', function() { this.prevPage() }.bind(this));
  },
  nextPage: function(){
    this.setState({
      videos: []
    });
    this.firebaseCursor.page.next();
  },
  prevPage: function(){
    this.setState({
      videos: []
    });
    this.firebaseCursor.page.prev();
  },
  gotoPage: function(pageNumber){
    this.setState({
      videos: []
    });
    this.firebaseCursor.page.setPage(pageNumber);
  },
  loadSampleVideos: function(){
    console.log("loading samples");
    this.setState({
      videos: require('./sample-videos')
    })
  },
  handlePaginationSelect: function(event, selectedEvent){
    this.gotoPage(selectedEvent.eventKey);
  },
  paginator: function(){
    return <Pagination onSelect={this.handlePaginationSelect} activePage={this.state.page} items={this.state.pageCount} maxButtons={10} first={true} last={false} next={true} prev={true} />;
  },
  render: function(){
    return (
      <div className="">
        {this.paginator()}
        <Loader loaded={this.state.videos.length}>
          {this.state.videos.map(function(video){
            return <Video key={video.id} {...video} />
          })}
        </Loader>
        {this.paginator()}
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
