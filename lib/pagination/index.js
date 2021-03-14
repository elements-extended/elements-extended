import css from './pagination.css';
import html from './pagination.html';
import {setHTML, addCss, removeCss, range, debounce} from '../common/util';

class XPagination extends HTMLElement {
  static get observedAttributes() { 
    return [
      'value', 'current-page', 'num-records-per-page', 'num-pages',
      'total-pages', 'total-records', 'display-type'
    ];
  }

  get value() { return this.totalRecords; }
  set value(val) {
    if (this.totalRecords !== val) {
      this.totalRecords = val;
      this.reset(this.currentPage);
    }
  }

  constructor(...args) {
    const self = super(...args);
    this.debug;
    this.totalRecords;
    this.totalPages;
    this.currentPage;
    this.numRecordsPerPage;
    // 1: page number, 2: start num, 3: end num, 4: start - end
    this.displayType; 
    this.numPages;
    this._initialized;
    this.reset = debounce(this._reset, 1000);

    return self;
  }

  connectedCallback() {
    addCss(this, css);
    this.debug = this.getAttribute('debug') !== null;
    this.currentPage = +this.getAttribute('current-page') || 1;
    this.numRecordsPerPage = +this.getAttribute('num-records-per-page') || 1;
    this.numPages = +this.getAttribute('num-pages') || 5;
    this.totalPages = +this.getAttribute('total-pages');
    this.totalRecords = +this.getAttribute('total-records') || 100;
    this.displayType = this.getAttribute('display-type') || 1;

    setHTML(this, html)
      .then(_ => {
        this.reset(this.currentPage);
        this._initialized = true;
      });
    this.addEventListener('click', this.handleClick.bind(this));
  }

  disconnectedCallback() {
    removeCss(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._initialized) return;
    const map = {
      'current-page': 'currentPage',
      'num-records-per-page': 'numRecordsPerPage',
      'num-pages' : 'numPages',
      'total-pages' : 'totalPages',
      'total-records' : 'totalRecords',
      'display-type': 'displayType'
    };
    if (map[name] && oldValue !== newValue) {
      this[map[name]] = +newValue;
      this.reset(this.currentPage);
    }
  }

  _reset(page) {
    this.currentPage = +page;
    (this.numPages % 2 === 0) && this.numPages++; // make it odd number
    this.totalPages = Math.ceil(this.totalRecords / this.numRecordsPerPage);

    this._setNavButtons();
    this._setPageButtons();

    const customEvent = new CustomEvent('x-page-selected', {
      bubbles: true,
      detail: {
        page: this.currentPage,
        offset: (this.currentPage - 1) * this.numRecordsPerPage,
        limit: this.numRecordsPerPage
      }
    });
    this.dispatchEvent(customEvent);
    this.debug && console.debug('<x-pagination> x-page-selected', customEvent);
  }

  getPages(currentPage, totalPages, numPages = 5) {
    const numNeighbor = (numPages - 1) / 2;
    let middlePage = currentPage;
    if ((numNeighbor*2 - currentPage) >= 1) { // currentPage is a low number
      middlePage = numNeighbor + 1;
    } else if ((numNeighbor + currentPage) > totalPages) { // currentPage is a high number
      middlePage = totalPages - numNeighbor;
    }
    const minPage = Math.max(middlePage - numNeighbor, 1);
    const maxPage = Math.min(totalPages, middlePage + numNeighbor);

    return range(minPage, maxPage);
  }
  
  _setNavButtons(page) {
    const firstPageBtn = this.querySelector('.first.page');
    const prevBtn = this.querySelector('.prev');
    const nextBtn = this.querySelector('.next');
    const lastPageBtn = this.querySelector('.last.page');
    
    const pages = 
      this.getPages(this.currentPage, this.totalPages, this.numPages);
    const [firstPage, lastPage] = [pages[0], pages.slice(-1)[0]];

    firstPageBtn.value = 1;
    firstPageBtn.disabled = firstPage < 2;
    prevBtn.disabled = firstPage < 2;
    prevBtn.value = this.currentPage - 1;
    nextBtn.disabled = (lastPage + 1) > this.totalPages;
    nextBtn.value = this.currentPage + 1;
    lastPageBtn.disabled =  (lastPage + 1) > this.totalPages;
    lastPageBtn.value = this.totalPages;
    const lastPagStaNum = 
      (this.totalPages - 1) * this.numRecordsPerPage + 1;
    const lastPagEndNum = this.totalRecords;
    lastPageBtn.innerText = this.displayType === 2 ? lastPagStaNum :
      this.displayType === 3 ? lastPagEndNum :
        this.displayType === 4 ? lastPagStaNum + '-' + lastPagEndNum : this.totalPages;
  }

  _setPageButtons() {
    const pages = 
      this.getPages(this.currentPage, this.totalPages, this.numPages);
    const pagesEl = this.querySelector('.pages');
    pagesEl.innerHTML = '';
    pages.forEach(page => {
      const selected = page === this.currentPage ? 'selected' : '';
      const offset = (page - 1) * this.numRecordsPerPage + 1;
      const endNum =  offset + this.numRecordsPerPage - 1;
      const text = this.displayType === 2 ? offset :
        this.displayType === 3 ? endNum :
          this.displayType === 4 ? offset + '-' + endNum : page;

      pagesEl.insertAdjacentHTML('beforeend', 
        `<button class="page ${selected}" value="${page}">
          ${text}
        </button>`
      );
    });
  }

  handleClick(event) {
    const clickedEl = event.target;
    if (clickedEl.classList.contains('page')) { 
      this.reset(clickedEl.value);
    }
  }

}

if (!customElements.get('x-pagination')) {
  customElements.define('x-pagination', XPagination);
}