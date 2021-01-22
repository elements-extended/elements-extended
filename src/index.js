// <body>...<script type="text/javascript" src="main.[hash].js"></script></body>
import '../src/style.css';
import '../src/app.scss';
import '../src/app.mobile.scss';

import '../lib';
import './tags/app-custom-css';
import './tags/app-pre';
import './tags/app-group-header';
import './tags/app-articles';
import './tags/app-prettier';
import './tags/app-facebook-comments';

// enable/disable outline for click and tab
document.body.addEventListener('click', 
  e => document.body.classList.remove('a11y-outline') );
document.body.addEventListener('keydown', 
  e => (e.key === 'Tab') && document.body.classList.add('a11y-outline') );

// Google analytics and adsense
window.addEventListener('DOMContentLoaded', function() {
  if (window.location.hostname !== 'localhost') {
    [ {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-5EB3NQZC8W', async: '' 
      },{
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', async: '',
        'data-ad-client': 'ca-pub-4555199270235339'
      }
    ].forEach( function addScriptEl(el) {
      var script = document.createElement('script');
      for(var key in el) { script[key] = el[key]; }
      document.head.appendChild(script);
    });
    setTimeout(function() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-5EB3NQZC8W');
    }, 1000);
  }
});
