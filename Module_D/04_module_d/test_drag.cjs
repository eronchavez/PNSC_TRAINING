// Quick drag test using Playwright
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Collect all console messages
  const logs = [];
  page.on('console', msg => {
    logs.push(msg.text());
    console.log('CONSOLE:', msg.text());
  });

  await page.goto('http://localhost:5174');
  await page.waitForTimeout(1000);

  // Click "Load Sample Photos"
  await page.click('button');
  await page.waitForTimeout(1000);

  // Check how many thumbnails are rendered
  const thumbCount = await page.locator('#controlImage img').count();
  console.log(`\nThumbnails rendered: ${thumbCount}`);

  if (thumbCount < 2) {
    console.log('Not enough thumbnails to test drag!');
    await browser.close();
    return;
  }

  // Get initial order (alt texts)
  const initialOrder = await page.locator('#controlImage img').evaluateAll(
    imgs => imgs.map(img => img.alt)
  );
  console.log('Initial order:', initialOrder);

  // Get bounding boxes of first two thumbnails
  const img0 = page.locator('#controlImage img').nth(0);
  const img1 = page.locator('#controlImage img').nth(2);
  
  const box0 = await img0.boundingBox();
  const box1 = await img1.boundingBox();
  
  console.log(`\nImg0 box:`, box0);
  console.log(`Img1 box:`, box1);

  // Check draggable attribute
  const draggable = await img0.getAttribute('draggable');
  console.log(`Draggable attribute: ${draggable}`);

  // Try to simulate drag and drop manually using dataTransfer
  // First, let's try Playwright's built-in dragTo
  console.log('\n--- Attempting drag from thumbnail 0 to thumbnail 2 ---');
  
  try {
    await img0.dragTo(img1);
    await page.waitForTimeout(500);
  } catch(e) {
    console.log('dragTo failed:', e.message);
  }

  // Check order after drag
  const afterOrder = await page.locator('#controlImage img').evaluateAll(
    imgs => imgs.map(img => img.alt)
  );
  console.log('After dragTo order:', afterOrder);
  
  const orderChanged = JSON.stringify(initialOrder) !== JSON.stringify(afterOrder);
  console.log(`Order changed: ${orderChanged}`);

  // Print all console logs from the page
  console.log('\n--- Page console logs ---');
  logs.forEach(l => console.log('  ', l));

  // If dragTo didn't work, try manual dispatch
  if (!orderChanged) {
    console.log('\n--- dragTo did NOT work. Trying manual event dispatch ---');
    
    await page.evaluate(() => {
      const imgs = document.querySelectorAll('#controlImage img');
      const src = imgs[0];
      const dst = imgs[2];
      
      // Create and dispatch dragstart
      const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dragStartEvent.dataTransfer.setData('text/plain', '0');
      src.dispatchEvent(dragStartEvent);
      
      // dragover on destination
      const dragOverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dst.dispatchEvent(dragOverEvent);
      
      // drop on destination
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dropEvent.dataTransfer.setData('text/plain', '0');
      dst.dispatchEvent(dropEvent);

      console.log('Manual events dispatched');
    });
    
    await page.waitForTimeout(500);
    
    const afterManualOrder = await page.locator('#controlImage img').evaluateAll(
      imgs => imgs.map(img => img.alt)
    );
    console.log('After manual dispatch order:', afterManualOrder);
    
    console.log('\n--- ALL Page console logs ---');
    logs.forEach(l => console.log('  ', l));
  }

  await browser.close();
  console.log('\nDone!');
})();
