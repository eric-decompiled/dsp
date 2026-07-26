import './style.css'

const ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
const baseUrl = import.meta.env.BASE_URL

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <header class="site-header">
      <a class="wordmark" href="${baseUrl}" aria-label="Candle Sats home"><span class="dot"></span>CANDLE/SATS</a>
      <a class="source-link" href="${baseUrl}">← Back to ledger</a>
    </header>
    <article class="about-page">
      <p class="eyebrow">ABOUT THE ADDRESS</p>
      <h1>The first ember.</h1>
      <p class="about-lede">${ADDRESS} is Bitcoin’s best-known address: the one associated with the network’s genesis block, block zero.</p>

      <section class="about-section">
        <span class="section-number">01</span>
        <div><h2>Bitcoin’s starting point</h2><p>The genesis block is the first block in the Bitcoin blockchain. It is the fixed point from which every fully synced node begins its view of the chain. Bitcoin’s developer documentation calls it block 0.</p><a href="https://developer.bitcoin.org/glossary.html#term-genesis-block" target="_blank" rel="noreferrer">Read the developer reference ↗</a></div>
      </section>
      <section class="about-section">
        <span class="section-number">02</span>
        <div><h2>A public memorial</h2><p>The genesis block contains the famous Times newspaper headline from January 3, 2009.</p><blockquote>“The Times 03/Jan/2009 Chancellor on brink of second bailout for banks”</blockquote><p>The address has become a public place for commemorative gifts, experiments, and messages of appreciation for Bitcoin’s origin.</p><a href="https://mempool.space/address/${ADDRESS}" target="_blank" rel="noreferrer">Inspect the address on-chain ↗</a></div>
      </section>
      <section class="about-section">
        <span class="section-number">03</span>
        <div><h2>What this project counts</h2><p>Candle / Sats visualizes voluntary transactions sent to this address after Bitcoin began. It does not make any claim about ownership, intent, or whether an individual transaction is a donation. It simply gives each on-chain receipt a small flame.</p></div>
      </section>

      <aside class="about-note"><span>NOTE</span><p>The 50 BTC subsidy recorded in the genesis block and later payments sent to this public address are separate things. This page tracks the latter, as reported by the public blockchain data API.</p></aside>
    </article>
  </main>
  <footer><a href="${baseUrl}">Candle / Sats</a> · A small on-chain memorial</footer>
`
