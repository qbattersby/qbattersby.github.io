$(document).foundation();

jQuery('.mega').fitText(0.28);
jQuery('.submega').fitText(0.34);

// Load MixPanel
(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==
typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,
    e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);
mixpanel.init("c92a5986631ed0a4b6c19404c128f2b0");

mixpanel.track_links('button.js-getit-link', 'Email Click from Get It Done Section');
mixpanel.track_links('button.icon-plus', 'Email Click from Plus Icon');
mixpanel.track_links('a.js-getintouch', 'Email Click from Large Get in Touch');
mixpanel.track_links('a.js-phone-link', 'Phone Number Click');


mixpanel.track_links('a.js-twitter-link', 'Twitter Visit');
mixpanel.track_links('a.js-aboutquinn-link', 'Email from About Quinn Section');



// Crazy Egg tracking
setTimeout(function(){var a=document.createElement("script");
    var b=document.getElementsByTagName("script")[0];
    a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0014/8176.js?"+Math.floor(new Date().getTime()/3600000);
    a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
