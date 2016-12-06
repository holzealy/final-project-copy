import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import newsbanner from './img/newsbanner.jpg';

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = { news: undefined }
    this.fetchData = this.fetchData.bind(this);
  }
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



  componentDidMount() {
    this.fetchData();
  }

  render() {
    var content = null;
    if (this.state.news) {
      content = <Stories storiesObj={this.state.news} />;
    }

    return (
      <div>
        <img className="banner" src={newsbanner} role="presentation" />
        <h1>News</h1>
        {content}
      </div>
    )
  }
}

//component UpcomingLaunches is the container for all of the launch cards
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

//component LaunchCard takes all the different launches and creates a "card" of information for each launch
class StoryCard extends React.Component {
  render() {
    //  var news = this.props.stories.docs;
    //  console.log(news);

    return (
      <MuiThemeProvider>
        <Card>
          <CardTitle title={this.props.story.headline.main} subtitle={this.props.story.pub_date} />
          <CardText>
            {this.props.story.snippet}
          </CardText>
          <CardActions>
            <a href={this.props.story.web_url}>
              <FlatButton label="Learn More" />
            </a>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    );
  }
}
export default News;
