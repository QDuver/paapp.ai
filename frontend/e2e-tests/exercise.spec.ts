import { test, expect } from '@playwright/test';

test('Create and delete an exercise', async ({ page }) => {
  // Navigate to the app with skipAuth parameter
  await page.goto('/?skipAuth=true');
  
  // Wait for the app to load
  await page.waitForTimeout(2000);
  
  // Switch to exercises tab
  await page.click('[data-testid="tab-exercises"]');
  
  // Wait for tab to load
  await page.waitForTimeout(1000);
  
  // Click the FAB (floating action button) to create a new exercise
  await page.click('[data-testid="add-exercise-fab"]');
  
  // Wait for dialog to open
  await page.waitForTimeout(1000);
  
  // Use a unique name with timestamp to avoid conflicts
  const uniqueName = `Test Exercise ${Date.now()}`;
  const testId = `exercise-card-${uniqueName.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Fill in the exercise name
  await page.waitForSelector('[data-testid="input-name"]', { timeout: 10000 });
  await page.fill('[data-testid="input-name"]', uniqueName);
  
  // Save the exercise
  await page.click('[data-testid="save-button"]');
  
  // Wait for the exercise to be created and displayed
  await page.waitForTimeout(1000);
  
  // Verify the exercise was created by checking if the exercise card is visible
  await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
  
  // Click on the exercise to edit it
  await page.click(`[data-testid="${testId}"]`);
  
  // Set up dialog handler before clicking delete
  page.on('dialog', async dialog => {
    console.log('Dialog appeared:', dialog.message());
    await dialog.accept();
  });
  
  // Click the delete button
  await page.click('[data-testid="delete-button"]');
  
  // Wait for the deletion to process
  await page.waitForTimeout(2000);
  
  // Verify the exercise was deleted - wait for the element to disappear
  await expect(page.locator(`[data-testid="${testId}"]`)).not.toBeVisible({ timeout: 10000 });
});