export default class Catcher {
  constructor() {
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
    });
  }
}
