// Autonomatex static dry-van dispatch workflow. Real integrations connect later through approved APIs.
const sampleLoads = [
  { lane: 'Dallas, TX → Chicago, IL', miles: 925, rate: 2350, rpm: 2.54, status: 'Call #1', reason: 'Best balance of RPM, dry-van lane fit, and reload potential.' },
  { lane: 'Fort Worth, TX → St. Louis, MO', miles: 640, rate: 1650, rpm: 2.57, status: 'Call #2', reason: 'Strong RPM and acceptable pickup timing.' },
  { lane: 'Dallas, TX → Kansas City, MO', miles: 510, rate: 1250, rpm: 2.45, status: 'Call #3', reason: 'Good RPM, shorter run, solid backup.' },
  { lane: 'Dallas, TX → New York, NY', miles: 1547, rate: 2900, rpm: 1.87, status: 'Rejected', reason: 'No NYC preference and low RPM.' },
  { lane: 'Waco, TX → Denver, CO', miles: 798, rate: 1400, rpm: 1.75, status: 'Rejected', reason: 'Below minimum RPM and weak reload fit.' },
  { lane: 'Dallas, TX → Memphis, TN', miles: 452, rate: 850, rpm: 1.88, status: 'Rejected', reason: 'Below minimum RPM.' }
];

function renderDemo(){
  const list=document.getElementById('loadList');
  const box=document.getElementById('decisionBox');
  if(!list||!box) return;
  list.innerHTML=sampleLoads.map(load=>`<div class="load-item"><div><strong>${load.lane}</strong><span>${load.miles} mi · $${load.rate.toLocaleString()} · $${load.rpm.toFixed(2)}/mi</span></div><span class="pill ${load.status==='Rejected'?'red':'green'}">${load.status}</span></div>`).join('');
  box.innerHTML=`<h4>Call Dallas → Chicago first.</h4><p>It matches Truck 12's Midwest preference, clears the $2.30 minimum, avoids no-go areas, and has the strongest reload profile.</p><ol><li>Ask: $2,450</li><li>Minimum: $2,250</li><li>Walk away below: $2,150</li><li>Rejected loads saved into Truck Memory.</li></ol>`;
}
renderDemo();
document.getElementById('rerankBtn')?.addEventListener('click', renderDemo);

function isPlaceholder(url){
  return !url || url.includes('REPLACE_WITH') || url === '#';
}

function showPaymentNotice(plan){
  let notice=document.getElementById('paymentNotice');
  if(!notice){
    notice=document.createElement('div');
    notice.id='paymentNotice';
    notice.className='payment-notice';
    document.body.appendChild(notice);
  }
  notice.innerHTML=`<strong>Stripe payment link needed</strong><span>The ${plan} payment button is ready, but the real Stripe Payment Link must be added in config.js before public paid outreach.</span>`;
  notice.classList.add('show');
  setTimeout(()=>notice.classList.remove('show'),7000);
  document.getElementById('paid-pilot')?.scrollIntoView({behavior:'smooth'});
}

document.querySelectorAll('.payment-link').forEach(btn=>{
  btn.addEventListener('click', event=>{
    const plan=btn.getAttribute('data-plan');
    const links=window.AUTONOMATEX_PAYMENT_LINKS || {};
    const url=links[plan];
    if(isPlaceholder(url)){
      event.preventDefault();
      showPaymentNotice(btn.textContent.trim());
      const select=document.querySelector('select[name="plan_interest"]');
      if(select){
        const text=btn.closest('.price-card')?.querySelector('h3')?.textContent || '';
        [...select.options].forEach(option=>{ if(option.textContent.includes(text) || (plan==='pilot' && option.textContent.includes('Pilot'))) select.value=option.value; });
      }
      return;
    }
    event.preventDefault();
    window.location.href=url;
  });
});


// Header hamburger menu for desktop and mobile navigation.
(function(){
  const header=document.querySelector('.site-header');
  const toggle=document.querySelector('.menu-toggle');
  if(!header || !toggle) return;
  const closeMenu=()=>{header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');};
  toggle.addEventListener('click', function(event){
    event.stopPropagation();
    const open=header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.menu-panel a').forEach(link=>link.addEventListener('click', closeMenu));
  document.addEventListener('click', function(event){
    if(!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') closeMenu();
  });
})();
