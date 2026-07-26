import './style.css'

const ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
const API_URL = `https://blockchain.info/rawaddr/${ADDRESS}`
const PAGE_SIZE = 50
const baseUrl = import.meta.env.BASE_URL

type Transaction = {
  hash: string
  out: Array<{ value: number; addr?: string }>
  block_height?: number
  time: number
}

type ReceivedTransaction = {
  txid: string
  amount: number
  confirmed: boolean
  time?: number
}

const formatSats = (sats: number) => new Intl.NumberFormat('en-US').format(sats)
const formatDate = (timestamp?: number) => timestamp
  ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(timestamp * 1000)
  : 'Unconfirmed'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <header class="site-header">
      <a class="wordmark" href="${baseUrl}" aria-label="Candle Sats home"><span class="dot"></span>CANDLE/SATS</a>
      <div class="header-links"><a class="source-link" href="${baseUrl}about.html">About</a><a class="source-link" href="https://mempool.space/address/${ADDRESS}" target="_blank" rel="noreferrer">View on mempool <span aria-hidden="true">↗</span></a></div>
    </header>

    <section class="intro">
      <p class="eyebrow">THE GENESIS ADDRESS</p>
      <h1>A live candle ledger for every transaction sent to Bitcoin’s genesis address.</h1>
      <p class="address"><span>₿</span>${ADDRESS}</p>
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
`

const transactionEl = document.querySelector<HTMLDivElement>('#transactions')!
const statsEl = document.querySelector<HTMLDivElement>('#stats')!
const refreshButton = document.querySelector<HTMLButtonElement>('#refresh')!
const syncStatusEl = document.querySelector<HTMLParagraphElement>('#sync-status')!
const previousPageButton = document.querySelector<HTMLButtonElement>('#previous-page')!
const nextPageButton = document.querySelector<HTMLButtonElement>('#next-page')!
const pageIndicator = document.querySelector<HTMLSpanElement>('#page-indicator')!
const balanceSatsEl = document.querySelector<HTMLElement>('#balance-sats')!
const balanceBtcEl = document.querySelector<HTMLElement>('#balance-btc')!
let currentPage = 0
let transactionCount: number | undefined

function receivedTransactions(transactions: Transaction[]) {
  return transactions
    .map((transaction): ReceivedTransaction | null => {
      const amount = transaction.out
        .filter((output) => output.addr === ADDRESS)
        .reduce((sum, output) => sum + output.value, 0)
      return amount > 0
        ? { txid: transaction.hash, amount, confirmed: transaction.block_height !== undefined, time: transaction.time }
        : null
    })
    .filter((transaction): transaction is ReceivedTransaction => transaction !== null)
}

async function fetchTransactionPage(page: number) {
  const response = await fetch(`${API_URL}?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`)
  if (!response.ok) throw new Error(`The Bitcoin API returned ${response.status}.`)
  const payload = await response.json() as { n_tx: number; final_balance: number; txs: Transaction[] }
  transactionCount = payload.n_tx
  balanceSatsEl.textContent = `${formatSats(payload.final_balance)} sats`
  balanceBtcEl.textContent = `${(payload.final_balance / 100_000_000).toFixed(8)} BTC`
  return receivedTransactions(payload.txs)
}

function renderTransactions(transactions: ReceivedTransaction[]) {
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  statsEl.innerHTML = `
    <div><strong>${formatSats(transactions.length)}</strong><span>ledger entries shown</span></div>
    <div><strong>${formatSats(total)}</strong><span>sats represented</span></div>
    <div><strong>${(total / 100_000_000).toFixed(8)}</strong><span>BTC represented</span></div>
  `

  if (!transactions.length) {
    transactionEl.innerHTML = '<p class="empty">No received transactions were found.</p>'
    return
  }

  const maxAmount = Math.max(...transactions.map((transaction) => transaction.amount))
  transactionEl.innerHTML = transactions.map((transaction, index) => {
    const flameHeight = 42 + (Math.log10(transaction.amount + 1) / Math.log10(maxAmount + 1)) * 100
    const shortId = `${transaction.txid.slice(0, 8)}…${transaction.txid.slice(-6)}`
    const signature = Number.parseInt(transaction.txid.slice(0, 6), 16)
    const waxHue = 15 + signature % 34
    const waxHeight = 40 + (signature >> 4) % 27
    const waxWidth = 28 + (signature >> 9) % 13
    const flameLean = (signature % 9) - 4
    const wickHeight = 15 + (signature >> 13) % 12
    const dripOffset = 3 + (signature >> 17) % 12
    return `
      <article class="transaction" style="--flame-height: ${flameHeight.toFixed(1)}px; --delay: ${(index % 12) * -0.37}s; --wax-hue: ${waxHue}; --wax-height: ${waxHeight}px; --wax-width: ${waxWidth}px; --flame-lean: ${flameLean}deg; --wick-height: ${wickHeight}px; --drip-offset: ${dripOffset}px">
        <div class="candle-stage" aria-hidden="true">
          <div class="flame"><i></i></div>
          <div class="wick"></div>
          <div class="wax"><span class="wax-shine"></span><span class="drip drip-one"></span><span class="drip drip-two"></span></div>
          <div class="holder"></div>
        </div>
        <div class="transaction-info">
          <p class="sats">${formatSats(transaction.amount)} <span>sats</span></p>
          <p class="date">${formatDate(transaction.time)}${transaction.confirmed ? '' : ' · pending'}</p>
          <a href="https://mempool.space/tx/${transaction.txid}" target="_blank" rel="noreferrer" class="txid">${shortId}<span aria-hidden="true">↗</span></a>
        </div>
      </article>
    `
  }).join('')
}

function updatePagination() {
  previousPageButton.disabled = currentPage === 0
  nextPageButton.disabled = transactionCount !== undefined && (currentPage + 1) * PAGE_SIZE >= transactionCount
  pageIndicator.textContent = transactionCount
    ? `Page ${currentPage + 1} of ${Math.ceil(transactionCount / PAGE_SIZE)}`
    : `Page ${currentPage + 1}`
}

async function loadPage(page: number) {
  currentPage = page
  refreshButton.disabled = true
  previousPageButton.disabled = true
  nextPageButton.disabled = true
  syncStatusEl.textContent = `Loading page ${page + 1} · 50 transactions from the chain…`
  transactionEl.innerHTML = '<div class="loading"><span class="spinner"></span>Loading 50 transactions from the chain…</div>'
  try {
    const pageTransactions = await fetchTransactionPage(page)
    renderTransactions(pageTransactions)
    syncStatusEl.textContent = `Live page ${page + 1} · 50 transactions per page`
  } catch (error) {
    transactionEl.innerHTML = '<div class="error"><strong>Unable to load this page.</strong><span>The public Bitcoin API is temporarily unavailable. Try again in a moment.</span></div>'
    syncStatusEl.textContent = 'Live data is temporarily unavailable'
  } finally {
    refreshButton.disabled = false
    updatePagination()
  }
}

refreshButton.addEventListener('click', () => loadPage(currentPage))
previousPageButton.addEventListener('click', () => loadPage(Math.max(0, currentPage - 1)))
nextPageButton.addEventListener('click', () => loadPage(currentPage + 1))
updatePagination()
loadPage(0)
