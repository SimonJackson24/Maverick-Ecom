import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    skipAudits: ['uses-http2'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
};

const PAGES_TO_TEST = [
  '/',
  '/products',
  '/cart',
  '/checkout',
  '/account',
  '/wishlist',
];

async function runLighthouseTest(url, config) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { 
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
    onlyCategories: config.settings.onlyCategories,
  };

  const runnerResult = await lighthouse(url, options, config);
  await chrome.kill();

  return runnerResult;
}

async function saveReport(result, pagePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.join(__dirname, 'reports', timestamp);
  
  await fs.mkdir(reportDir, { recursive: true });
  
  // Save HTML report
  const htmlReport = path.join(reportDir, `${pagePath.replace(/\//g, '_')}.html`);
  await fs.writeFile(htmlReport, result.report);
  
  // Save metrics JSON
  const metrics = {
    performance: result.lhr.categories.performance.score * 100,
    accessibility: result.lhr.categories.accessibility.score * 100,
    bestPractices: result.lhr.categories['best-practices'].score * 100,
    seo: result.lhr.categories.seo.score * 100,
    firstContentfulPaint: result.lhr.audits['first-contentful-paint'].numericValue,
    speedIndex: result.lhr.audits['speed-index'].numericValue,
    largestContentfulPaint: result.lhr.audits['largest-contentful-paint'].numericValue,
    timeToInteractive: result.lhr.audits['interactive'].numericValue,
    totalBlockingTime: result.lhr.audits['total-blocking-time'].numericValue,
    cumulativeLayoutShift: result.lhr.audits['cumulative-layout-shift'].numericValue,
  };
  
  const metricsFile = path.join(reportDir, `${pagePath.replace(/\//g, '_')}_metrics.json`);
  await fs.writeFile(metricsFile, JSON.stringify(metrics, null, 2));
  
  return { htmlReport, metricsFile };
}

async function runTests() {
  console.log('Starting performance tests...');
  
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
  const results = [];
  
  for (const page of PAGES_TO_TEST) {
    console.log(`Testing ${page}...`);
    try {
      const result = await runLighthouseTest(`${baseUrl}${page}`, config);
      const savedFiles = await saveReport(result, page);
      results.push({
        page,
        scores: {
          performance: result.lhr.categories.performance.score * 100,
          accessibility: result.lhr.categories.accessibility.score * 100,
          bestPractices: result.lhr.categories['best-practices'].score * 100,
          seo: result.lhr.categories.seo.score * 100,
        },
        reports: savedFiles,
      });
    } catch (error) {
      console.error(`Error testing ${page}:`, error);
    }
  }
  
  // Generate summary report
  const summary = {
    timestamp: new Date().toISOString(),
    results,
  };
  
  const summaryFile = path.join(__dirname, 'reports', 'latest-summary.json');
  await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
  
  console.log('Performance tests completed!');
  console.log('Summary:', summary);
}

runTests().catch(console.error);
