import { CONSENT_STORAGE_KEY } from './consent';

export function buildGoogleTagManagerScript(containerIds: string[]): string {
  return `
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
var storedConsent = null;
try { storedConsent = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}); } catch (error) {}
window.gtag('consent', 'default', {
  analytics_storage: storedConsent === 'granted' ? 'granted' : 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
window.gtag('js', new Date());
${JSON.stringify(containerIds)}.forEach(function (containerId) {
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var first = document.getElementsByTagName('script')[0];
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + containerId;
  first.parentNode.insertBefore(script, first);
});
`;
}

export function buildGoogleTagManagerNoscriptUrl(containerId: string): string {
  return `https://www.googletagmanager.com/ns.html?id=${containerId}`;
}
