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
  let dataHTML = '';
  let resultCount = 0;
  let prefix = "<section><form class='frmResults'><fieldset>";
  let suffix = "</fieldset></form></section>";
  dataHTML = results.items.map((item, index) => {
    return formatResult(item);
  });

  setNextPageToken(results.nextPageToken);
  setLastPageToken(results.prevPageToken);

  for (let i = 0; i < results.items.length; i++) {
    resultCount += ('youtube#video' === results.items[i].id.kind);
  }
  //$('.numResults').html(resultCount);

  //$('.js-search-results-wrapper')
  // .prop('hidden', false);
  $('.js-search-results')
  .prop('hidden', false)
    .html(dataHTML);
  //$('.js-search-results-footer') 
  //  .html(buildFooter())
  // .prop('hidden', false);
}

function formatResult(item) {

  if (item.id.kind !== 'youtube#video') { return null; }
  if (item.id.kind === 'youtube#video') {
    return `      
    <p>Hello</p>  
  `;
  }
}

function handleSubmit(isBack) {

  //extract the value from the input
  let queryVal, pageNumber;

  $('.js-search-results').html('');
  queryVal = $('.js-query').val();
  pageNumber = (!isBack) ? getNextPageToken() : getPrevPageToken();
  //call the API (query value, callback)
  setTimeout(function () {
    getDataFromYouTube(queryVal, pageNumber, fillResults);
  }, 1000);

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
  $('button').click(function (event) {
    event.preventDefault();
    setNextPageToken('');
    setLastPageToken('');
    handleSubmit(false);
  });
  $('.js-search-results-footer').on('click', '.moreResults', function (event) {
    event.preventDefault();
    handleSubmit(false);
  });
  $('.js-search-results-footer').on('click', '.lessResults', function (event) {
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