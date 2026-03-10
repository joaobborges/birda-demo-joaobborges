#!/usr/bin/env node
/**
 * Download bird images from Wikipedia/Wikimedia Commons
 * Saves as JPEG files in src/assets/birds/{kebab-name}.jpg
 *
 * Usage: node scripts/download-images.js
 * Or:    npm run download-images
 *
 * Re-runnable: already-downloaded files are skipped.
 * Wikipedia rate-limits aggressively; if you see 429 errors, wait a few minutes and re-run.
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'birds')

// Verified Wikimedia Commons thumbnail URLs (confirmed working March 2026)
const BIRDS = [
  { name: 'European Robin',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Erithacus_rubecula_with_cocked_head.jpg/320px-Erithacus_rubecula_with_cocked_head.jpg' },
  { name: 'Common Blackbird',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Common_Blackbird.jpg/320px-Common_Blackbird.jpg' },
  { name: 'White Stork',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/White_stork_%28Ciconia_ciconia%29_in_flight.jpg/320px-White_stork_%28Ciconia_ciconia%29_in_flight.jpg' },
  { name: 'Eurasian Blue Tit',  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Parus_caeruleus_voering.jpg/320px-Parus_caeruleus_voering.jpg' },
  { name: 'Sardinian Warbler',  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Sardinian_Warbler.jpg/330px-Sardinian_Warbler.jpg' },
  { name: 'House Sparrow',      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Passer_domesticus_male_%2815%29.jpg/320px-Passer_domesticus_male_%2815%29.jpg' },
  { name: 'Common Swift',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Apus_apus_01.jpg/320px-Apus_apus_01.jpg' },
  { name: 'Serin',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/European_serin_%28Serinus_serinus%29_male.jpg/330px-European_serin_%28Serinus_serinus%29_male.jpg' },
  { name: 'Goldfinch',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Carduelis_carduelis_close_up.jpg/320px-Carduelis_carduelis_close_up.jpg' },
  { name: 'Grey Heron',         url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ardea_cinerea_2.jpg/320px-Ardea_cinerea_2.jpg' },
  { name: 'Peregrine Falcon',   url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Falco_peregrinus_good_-_Christopher_Watson.jpg/320px-Falco_peregrinus_good_-_Christopher_Watson.jpg' },
  { name: 'Common Kingfisher',  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Alcedo_atthis_-England-8_%28cropped%29.jpg/330px-Alcedo_atthis_-England-8_%28cropped%29.jpg' },
  { name: 'Hoopoe',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Upupa_epops_Madrid_01.jpg/330px-Upupa_epops_Madrid_01.jpg' },
  { name: 'Little Egret',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Egretta_garzetta_-_Laem_Pak_Bia.jpg/320px-Egretta_garzetta_-_Laem_Pak_Bia.jpg' },
  { name: 'Eurasian Spoonbill', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Eurasian_Spoonbill-2.jpg/330px-Eurasian_Spoonbill-2.jpg' },
  { name: 'Black Stork',        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ciconia_nigra_-Kruger_National_Park-8.jpg/330px-Ciconia_nigra_-Kruger_National_Park-8.jpg' },
  { name: 'Eagle Owl',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bubo_bubo_3_%28Martin_Mecnarowski%29.jpg/330px-Bubo_bubo_3_%28Martin_Mecnarowski%29.jpg' },
  { name: 'Flamingo',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg/330px-010_Greater_flamingos_male_and_female_in_the_Camargue_during_mating_season_Photo_by_Giles_Laurent.jpg' },
  { name: 'Bee-eater',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Guepier_d%27europe_au_parc_national_Ichkeul.jpg/330px-Guepier_d%27europe_au_parc_national_Ichkeul.jpg' },
  { name: 'Iberian Magpie',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Iberian_magpie_%28Cyanopica_cooki%29_2.jpg/330px-Iberian_magpie_%28Cyanopica_cooki%29_2.jpg' },
]

function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function downloadUrl(url, redirectsLeft = 15) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft <= 0) {
      reject(new Error('Too many redirects'))
      return
    }

    let parsedUrl
    try {
      parsedUrl = new URL(url)
    } catch (e) {
      reject(new Error(`Invalid URL: ${url}`))
      return
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http

    const req = protocol.get(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'BirdaApp/1.0 (https://birda.org; contact@birda.org) Node.js',
          'Accept': 'image/jpeg,image/*',
        },
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers['location']
          if (!location) {
            reject(new Error('Redirect with no location header'))
            return
          }
          res.resume()
          const nextUrl = location.startsWith('http')
            ? location
            : `${parsedUrl.protocol}//${parsedUrl.hostname}${location}`
          resolve(downloadUrl(nextUrl, redirectsLeft - 1))
          return
        }

        if (res.statusCode === 429) {
          res.resume()
          reject(new Error(`HTTP 429 (rate limit) — wait a few minutes and re-run`))
          return
        }

        if (res.statusCode !== 200) {
          res.resume()
          reject(new Error(`HTTP ${res.statusCode}`))
          return
        }

        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => resolve(Buffer.concat(chunks)))
        res.on('error', reject)
      }
    )
    req.on('error', reject)
    req.setTimeout(30000, () => {
      req.destroy(new Error('Request timeout'))
    })
  })
}

async function downloadWithRetry(url, maxRetries = 2, baseDelay = 3000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await downloadUrl(url)
    } catch (err) {
      if (attempt < maxRetries && (err.message.includes('429') || err.message.includes('timeout'))) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`  Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`)
        await sleep(delay)
      } else {
        throw err
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  console.log(`Downloading ${BIRDS.length} bird images to:\n  ${OUTPUT_DIR}\n`)

  let successCount = 0
  let failCount = 0

  for (const bird of BIRDS) {
    const kebabName = toKebabCase(bird.name)
    const outputPath = path.join(OUTPUT_DIR, `${kebabName}.jpg`)

    // Skip if already downloaded with real content (>1KB)
    if (fs.existsSync(outputPath)) {
      const stat = fs.statSync(outputPath)
      if (stat.size > 1000) {
        console.log(`Skip (exists): ${kebabName}.jpg (${Math.round(stat.size / 1024)}KB)`)
        successCount++
        continue
      }
    }

    try {
      await sleep(800)
      const data = await downloadWithRetry(bird.url)
      fs.writeFileSync(outputPath, data)
      console.log(`Downloaded: ${kebabName}.jpg (${Math.round(data.length / 1024)}KB)`)
      successCount++
    } catch (err) {
      console.error(`ERROR: ${kebabName} — ${err.message}`)
      failCount++
    }
  }

  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.jpg'))
  console.log(`\nResult: ${successCount}/${BIRDS.length} succeeded, ${failCount} failed`)
  console.log(`Total files in src/assets/birds/: ${files.length}`)

  if (failCount > 0) {
    console.log('\nNote: If you got 429 errors, Wikipedia is rate-limiting. Wait a few minutes and re-run.')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
