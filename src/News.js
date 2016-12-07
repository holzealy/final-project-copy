import React from 'react';
import $ from 'jquery';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = { news: undefined }
    this.fetchData = this.fetchData.bind(this);
  }
  //fetches data from NYT API
  fetchData() {
    var thisComponent = this;
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    var newUrl = url + '?' + $.param({
      'api-key': "57dc3b4f1c5a432fa6979797629a230f",
      'q': "immigration",
      'sort': "newest"
    });
    fetch(newUrl)
      .then(function (response) {
        var newPromise = response.json();
        console.log(response)
        return newPromise;
      })
      .then(function (data) {
        console.log(data);
        thisComponent.setState({ news: data.response })
      });
  }

  //fetch data upon load
  componentDidMount() {
    this.fetchData();
  }

  //render stories after the fetch
  render() {
    var content = null;
    if (this.state.news) {
      content = <Stories storiesObj={this.state.news} />;
    }

    //return news page
    return (
      <div>
        <div className="header-cont">
          <header className="main-header news-header">
            <div className="header-text">
              <h1 className="header-title">News</h1>
              <p className="header-desc">A newsfeed focusing on immigration matters straight from the NYTimes.</p>
            </div>
          </header>
        </div>
        <div className="container">
          <br />
          {content}
          <p>Credit: <a href="http://developer.nytimes.com/">NY Times developer</a></p>
        </div>
      </div>
    )
  }
}

//component Stories is the container for all of the launch cards
class Stories extends React.Component {
  render() {
    var news = this.props.storiesObj.docs;
    console.log(news);
    var StoryCardArray = news.map(function (story) {
      return <StoryCard story={story} key={story.web_url} />
    });
    return (
      <div className="container">
        {StoryCardArray}
      </div>
    );
  }
}

//component StoryCard takes all the different stories and creates a "card" of information for each story
class StoryCard extends React.Component {
  render() {
    //  var news = this.props.stories.docs;
    //  console.log(news);
    return (
      <div className="post">
        <MuiThemeProvider>
          <Card>
            <CardTitle title={this.props.story.headline.main} subtitle={this.props.story.pub_date} />
            <CardText>
              {this.props.story.snippet}
            </CardText>
            <CardActions>
              <a target="_blank" href={this.props.story.web_url}>
                <RaisedButton label="Learn More" />
              </a>
            </CardActions>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }
}
export default News;
