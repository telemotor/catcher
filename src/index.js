import v4 from '../node_modules/uuid/v4';

export default class Catcher {
  constructor(telemotorUrl) {
    this.telemotorUrl = telemotorUrl;
    this.customUserId = '';
    this.makeUserId();
    this.makeSession();
    this.trackPageView();
  }

  setCustomUserId(id) {
    this.customUserId = id;
  }

  getCustomUserId() {
    return this.customUserId;
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

  makeUserId() {
    if (this.getUserId() === null) {
      // 2048 days
      this.createCookie('tid', v4(), 2048 * 24 * 60 * 60 * 1000);
    }
  }

  getUserId() {
    return this.readCookie('tid');
  }

  makeSession() {
    if (this.getSession() === null) {
      // 1 minute
      this.createCookie('tsid', v4(), 300000);
    }
  }

  getSession() {
    return this.readCookie('tsid');
  }

  createCookie(name, value, millis) {
    let expires;

    if (millis) {
      let date = new Date();

      date.setTime(date.getTime() + millis);
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  // Read cookie
  readCookie(name) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  startWatch() {
    let self = this;

    document.addEventListener('click', function (e) {
      self.sendClick(e);
    });
  }

  sendClick(e) {
    let body = {
      xpath: this.getXPath(e.target),
      href: location.href,
      userid: this.getUserId(),
      customuserid: this.getCustomUserId(),
      sessionid: this.getSession(),
      x: e.pageX,
      y: e.pageY
    };

    this.makeSession();
    this.sendResuest('/api/click', body);
  }

  trackPageView() {
    let body = {
      href: location.href,
      userid: this.getUserId(),
      customuserid: this.getCustomUserId(),
      sessionid: this.getSession()
    };

    this.makeSession();
    this.sendResuest('/api/pageview', body);
  }

  sendResuest(uri, body) {
    console.log(uri);
    console.log(body);
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

    // TOOD: return promise
    fetch(this.telemotorUrl + uri, init).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  }
}
