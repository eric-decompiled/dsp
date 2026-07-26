import"./style-C-7LLIxU.js";var e=`1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`,t=`https://blockchain.info/rawaddr/${e}`,n=50,r=`/apps/candle-sats/`,i=e=>new Intl.NumberFormat(`en-US`).format(e),a=e=>e?new Intl.DateTimeFormat(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}).format(e*1e3):`Unconfirmed`;document.querySelector(`#app`).innerHTML=`
  <main>
    <header class="site-header">
      <a class="wordmark" href="${r}" aria-label="Candle Sats home"><span class="dot"></span>CANDLE/SATS</a>
      <div class="header-links"><a class="source-link" href="${r}about.html">About</a><a class="source-link" href="https://mempool.space/address/${e}" target="_blank" rel="noreferrer">View on mempool <span aria-hidden="true">↗</span></a></div>
    </header>

    <section class="intro">
      <p class="eyebrow">THE GENESIS ADDRESS</p>
      <h1>A live candle ledger for every transaction sent to Bitcoin’s genesis address.</h1>
      <p class="address"><span>₿</span>${e}</p>
      <div class="bonfire-balance" aria-label="Address balance">
        <div class="bonfire" aria-hidden="true"><span class="fire-back"></span><span class="fire-left"></span><span class="fire-right"></span><span class="fire-core"></span><span class="log log-one"></span><span class="log log-two"></span></div>
        <div class="balance-copy"><span>ADDRESS BALANCE</span><strong id="balance-sats">Loading balance…</strong><small id="balance-btc">— BTC</small></div>
      </div>
    </section>

    <section class="ledger" aria-labelledby="ledger-title">
      <div class="ledger-head">
        <div>
          <p class="eyebrow">ON-CHAIN LEDGER</p>
          <h2 id="ledger-title">Received transactions</h2>
        </div>
        <div class="ledger-actions">
          <nav class="pagination" aria-label="Transaction pages">
            <button class="page-button" id="previous-page" type="button">← Previous</button>
            <span id="page-indicator">Page 1</span>
            <button class="page-button" id="next-page" type="button">Next →</button>
          </nav>
          <button class="refresh" id="refresh" type="button"><span aria-hidden="true">↻</span> Refresh</button>
        </div>
      </div>
      <p class="sync-status" id="sync-status">Choose a page to load 50 on-chain transactions</p>
      <div class="stats" id="stats" aria-live="polite"></div>
      <div class="transaction-grid" id="transactions" aria-live="polite">
        <div class="loading"><span class="spinner"></span>Gathering transactions from the chain…</div>
      </div>
    </section>
  </main>
  <footer>Live data from <a href="https://www.blockchain.com/explorer" target="_blank" rel="noreferrer">Blockchain.com</a> · Amounts are denominated in satoshis</footer>
`;var o=document.querySelector(`#transactions`),s=document.querySelector(`#stats`),c=document.querySelector(`#refresh`),l=document.querySelector(`#sync-status`),u=document.querySelector(`#previous-page`),d=document.querySelector(`#next-page`),f=document.querySelector(`#page-indicator`),p=document.querySelector(`#balance-sats`),m=document.querySelector(`#balance-btc`),h=0,g;function _(t){return t.map(t=>{let n=t.out.filter(t=>t.addr===e).reduce((e,t)=>e+t.value,0);return n>0?{txid:t.hash,amount:n,confirmed:t.block_height!==void 0,time:t.time}:null}).filter(e=>e!==null)}async function v(e){let r=await fetch(`${t}?limit=${n}&offset=${e*n}`);if(!r.ok)throw Error(`The Bitcoin API returned ${r.status}.`);let a=await r.json();return g=a.n_tx,p.textContent=`${i(a.final_balance)} sats`,m.textContent=`${(a.final_balance/1e8).toFixed(8)} BTC`,_(a.txs)}function y(e){let t=e.reduce((e,t)=>e+t.amount,0);if(s.innerHTML=`
    <div><strong>${i(e.length)}</strong><span>ledger entries shown</span></div>
    <div><strong>${i(t)}</strong><span>sats represented</span></div>
    <div><strong>${(t/1e8).toFixed(8)}</strong><span>BTC represented</span></div>
  `,!e.length){o.innerHTML=`<p class="empty">No received transactions were found.</p>`;return}let n=Math.max(...e.map(e=>e.amount));o.innerHTML=e.map((e,t)=>{let r=42+Math.log10(e.amount+1)/Math.log10(n+1)*100,o=`${e.txid.slice(0,8)}…${e.txid.slice(-6)}`,s=Number.parseInt(e.txid.slice(0,6),16),c=15+s%34,l=40+(s>>4)%27,u=28+(s>>9)%13,d=s%9-4,f=15+(s>>13)%12,p=3+(s>>17)%12;return`
      <article class="transaction" style="--flame-height: ${r.toFixed(1)}px; --delay: ${t%12*-.37}s; --wax-hue: ${c}; --wax-height: ${l}px; --wax-width: ${u}px; --flame-lean: ${d}deg; --wick-height: ${f}px; --drip-offset: ${p}px">
        <div class="candle-stage" aria-hidden="true">
          <div class="flame"><i></i></div>
          <div class="wick"></div>
          <div class="wax"><span class="wax-shine"></span><span class="drip drip-one"></span><span class="drip drip-two"></span></div>
          <div class="holder"></div>
        </div>
        <div class="transaction-info">
          <p class="sats">${i(e.amount)} <span>sats</span></p>
          <p class="date">${a(e.time)}${e.confirmed?``:` · pending`}</p>
          <a href="https://mempool.space/tx/${e.txid}" target="_blank" rel="noreferrer" class="txid">${o}<span aria-hidden="true">↗</span></a>
        </div>
      </article>
    `}).join(``)}function b(){u.disabled=h===0,d.disabled=g!==void 0&&(h+1)*n>=g,f.textContent=g?`Page ${h+1} of ${Math.ceil(g/n)}`:`Page ${h+1}`}async function x(e){h=e,c.disabled=!0,u.disabled=!0,d.disabled=!0,l.textContent=`Loading page ${e+1} · 50 transactions from the chain…`,o.innerHTML=`<div class="loading"><span class="spinner"></span>Loading 50 transactions from the chain…</div>`;try{y(await v(e)),l.textContent=`Live page ${e+1} · 50 transactions per page`}catch{o.innerHTML=`<div class="error"><strong>Unable to load this page.</strong><span>The public Bitcoin API is temporarily unavailable. Try again in a moment.</span></div>`,l.textContent=`Live data is temporarily unavailable`}finally{c.disabled=!1,b()}}c.addEventListener(`click`,()=>x(h)),u.addEventListener(`click`,()=>x(Math.max(0,h-1))),d.addEventListener(`click`,()=>x(h+1)),b(),x(0);