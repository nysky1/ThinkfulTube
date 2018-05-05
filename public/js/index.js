'use strict';
const isDebug = true;
const API_KEY = 'AIzaSyA0sGD6XCJl2wcEWMgYHGR8g2UgG-MGN4o';
const API_URL = 'https://www.googleapis.com/youtube/v3/search'


function getDataFromYouTube(queryVal, pageNumber, callback) { 
  console.log('Calling API');
 
  const query = {
    q: `${queryVal}`,
    part: 'snippet',
    maxResults: 5,
    key: API_KEY,
    pageToken: pageNumber
  };
  //console.log(query);
  $.getJSON(API_URL, query, callback);
  
}

function buildFooter() {
  return `<div class='footer'>
  <button class='lessResults'>Previous</button>&nbsp;|&nbsp;<button class='moreResults'>Next</button>
  </div>`;
}

function fillResults(results) { 
  let dataHTML = '', finalHTML = '';
  let resultCount = 0;
  dataHTML = results.items.map(  (item, index) => {
    return formatResult(item,index);
  } ).join('');
  
  setNextPageToken(results.nextPageToken);
  setLastPageToken(results.prevPageToken);  

  resultCount = results.items.length;

  finalHTML = `<p>Results: ${resultCount}</p>` + dataHTML;

    $('.js-search-results')
    .prop('hidden', false)
    .html(finalHTML);    
    //.html(dataHTML);    
  }

function formatResult(item,index) { 
  const youTubeLink = 'https://www.youtube.com/watch?v=';
  let vId = ((item.id.videoId === undefined) ? '#' : youTubeLink + `${item.id.videoId}`);
  return `
  <div class='block'>
    <p>${index+1}. ${item.snippet.title}
    </p>
    <div class='mainImage'>
      <a target='_new' href='${vId}' aria-label='Open New Window of Video titled ${item.snippet.title}.'><img alt='${index+1} ${item.snippet.title}' src='${item.snippet.thumbnails.medium.url}' height=150 width=150 /></a>
    </div>
  <div class='moreInfo'><a target="_new" aria-label="Open New Window of more videos of channel ${item.snippet.channelTitle}." rel="noopener noreferrer" href='https://www.youtube.com/channel/${item.snippet.channelId}'>More Videos from Channel </a>
  </div>
  `;
}

function handleSubmit(isBack) { 

  //extract the value from the input
  let queryVal, pageNumber;
  
  $('.js-search-results').html('');
  queryVal = $('.js-query').val();
  pageNumber = (!isBack) ? getNextPageToken() : getPrevPageToken();
  //call the API (query value, callback)
  getDataFromYouTube(queryVal, pageNumber, fillResults);
}
function getNextPageToken() {
  return $('.js-query-page-number').val();
}
function getPrevPageToken() {
  return $('.js-query-page-number-prior').val();
}
function setNextPageToken(value) {
  return $('.js-query-page-number').val(value);
}
function setLastPageToken(value) {
  return $('.js-query-page-number-prior').val(value);
}

function hookSubmit() { 
  $('button').click( function (event) {
    event.preventDefault();
    setNextPageToken('');
    setLastPageToken('');
    handleSubmit(false);
  });
  $('.js-search-results-footer').on('click', '.moreResults', function(event) {
    event.preventDefault();
    handleSubmit(false);
  });
  $('.js-search-results-footer').on('click', '.lessResults', function(event) {
    event.preventDefault();
    handleSubmit(true);
  });
  

}

/* END VALIDATION */
function dWrite(item) {
    (isDebug) ? console.log(`${item}`) : '';
}

$(hookSubmit());
//watch the submit button