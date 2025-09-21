import { test, expect } from '@playwright/test';

test('Create exercise and manage sets', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Wait for the app to load
  await page.waitForTimeout(2000);
  
  // Switch to exercises tab
  await page.click('[data-testid="tab-exercises"]');
  
  // Wait for tab to load
  await page.waitForTimeout(1000);
  
  // Create a new exercise for set testing
  await page.click('[data-testid="add-exercise-fab"]');
  await page.waitForTimeout(1000);
  
  const exerciseName = `Set Management Test ${Date.now()}`;
  const exerciseTestId = `exercise-card-${exerciseName.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Fill in the exercise name
  await page.waitForSelector('[data-testid="input-name"]', { timeout: 10000 });
  await page.fill('[data-testid="input-name"]', exerciseName);
  await page.click('[data-testid="save-button"]');
  await page.waitForTimeout(1000);
  
  // Verify the exercise was created
  await expect(page.locator(`[data-testid="${exerciseTestId}"]`)).toBeVisible();
  
  // Check if the exercise is already expanded, if not, click the expand button
  const expandButtonTestId = `expand-button-${exerciseName.toLowerCase().replace(/\s+/g, '-')}`;
  const expandButton = page.locator(`[data-testid="${expandButtonTestId}"]`);
  
  // Wait for the expand button to be visible (it should be there since exercises support sets)
  await expect(expandButton).toBeVisible();
  
  // Check if already expanded by looking for the down arrow (▼)
  const isExpanded = await expandButton.locator('text=▼').count() > 0;
  
  if (!isExpanded) {
    // Click the expand button to expand the exercise
    await expandButton.click();
    await page.waitForTimeout(500);
  }
  
  // Create a set - click the specific Add button for this exercise
  const addButtonTestId = `add-subcard-${exerciseName.toLowerCase().replace(/\s+/g, '-')}`;
  await page.click(`[data-testid="${addButtonTestId}"]`);
  await page.waitForTimeout(1000);
  
  // Fill in set details
  await page.fill('[data-testid="input-weightKg"]', '75');
  await page.fill('[data-testid="input-repetitions"]', '12');
  await page.fill('[data-testid="input-duration"]', '40');
  await page.fill('[data-testid="input-rest"]', '120');
  
  // Save the set
  await page.click('[data-testid="save-button"]');
  await page.waitForTimeout(1000);
  
  // Verify the set was created by checking the specific subcard exists
  const subcardTestId = `subcard-${exerciseName.toLowerCase().replace(/\s+/g, '-')}-0`;
  await expect(page.locator(`[data-testid="${subcardTestId}"]`)).toBeVisible();
  
  // Also verify the set text is visible within this specific subcard
  await expect(page.locator(`[data-testid="${subcardTestId}"]`).locator('text=75kg × 12 reps × 40s')).toBeVisible();
  
  // Delete the set - click on the specific subcard for this exercise (first set, index 0)
  await page.click(`[data-testid="${subcardTestId}"]`);
  await page.waitForTimeout(500);
  
  // Set up dialog handler before clicking delete
  page.on('dialog', async dialog => {
    console.log('Dialog appeared:', dialog.message());
    await dialog.accept();
  });
  
  // Wait for the edit dialog to appear and then click delete
  await page.waitForSelector('[data-testid="delete-button"]', { timeout: 5000 });
  await page.click('[data-testid="delete-button"]');
  await page.waitForTimeout(1000);
  
  // Verify the set was deleted - check that the specific subcard is no longer visible
  await expect(page.locator(`[data-testid="${subcardTestId}"]`)).not.toBeVisible();
});