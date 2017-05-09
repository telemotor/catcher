export default class Catcher {
  constructor(telemotorUrl) {
    this.telemotorUrl = telemotorUrl;
    this.trackPageView();
  }

  getXPath(element) {
    let xpath = '';

    for (;element && element.nodeType === 1; element = element.parentNode) {
      let id = Array.from(element.parentNode.getElementsByTagName(element.tagName)).indexOf(element) + 1;

      id > 1 ? (id = '[' + id + ']') : (id = '');
      xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }

    return xpath;
  }

  startWatch() {
    let self = this;

    document.addEventListener('click', function (e) {
      console.log(self.getXPath(e.target));
      self.sendClick(self.getXPath(e.target), location.href, e.pageX, e.pageY);
    });
  }

  sendClick(xpath, href, x, y) {
    let body = {
      xpath: xpath,
      href: href,
      x: x,
      y: y
    };

    body = Object.keys(body).map(function (key) {
      return key + '=' + body[key];
    }).join('&');

    let init = {
      method: 'post',
      mode: 'cors',
      cache: 'default',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: body
    };

    fetch(this.telemotorUrl + '/api/click', init).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  }

  trackPageView() {
    console.log(location.href);
  }
}
