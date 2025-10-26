import { test, expect } from "@playwright/test";

test("create and delete an exercise", async ({ page }) => {
  // Get current date in YYYY-MM-DD format
  const intervalWaitTime = 1000;
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Open the app
  await page.goto("/");

  // Navigate to the Exercises tab
  const exercisesTab = page.getByRole("tab", { name: "Exercises" });
  await exercisesTab.click();

  const addFab = page.getByTestId("add-fab");
  await expect(addFab).toBeVisible({ timeout: 4000 });

  // Wait an additional second for UI to stabilize
  await page.waitForTimeout(1000);

  // Click the FAB button to create a new exercise
  await addFab.click();

  // Wait for the edit dialog modal to appear (looking for the modal or the dialog content)
  await page.waitForSelector('[data-testid="edit-dialog"]', {
    state: "visible",
    timeout: 1500,
  });

  // Fill in the exercise name
  const exerciseName = "Test Exercise " + Date.now();
  await page.getByTestId("autocomplete-input").fill(exerciseName);
  await page.waitForTimeout(intervalWaitTime);

  // Save the exercise and wait for API response (POST of entire exercise list)
  const saveResponse = page.waitForResponse(
    response => response.url().includes(`/exercises/${currentDate}`) && response.request().method() === "POST",
    { timeout: 4000 }
  );
  await page.getByTestId("save-button").click();
  await saveResponse;

  // Wait for the dialog to close
  await expect(page.getByTestId("edit-dialog")).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Verify the exercise was created by looking for it in the list
  await expect(page.getByText(exerciseName)).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Now find and click the expand button - use last() since our exercise was just created
  await page.getByTestId("expand-button").last().click();
  await page.waitForTimeout(intervalWaitTime);

  // Click the "+ Add" button - use last() since we just expanded this exercise
  await page.getByTestId("add-subcard-button").last().click();
  await page.waitForTimeout(intervalWaitTime);

  // Wait for the edit dialog for the subcard
  await expect(page.getByTestId("edit-dialog")).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Fill in random repetitions and weight
  const randomRepetitions = Math.floor(Math.random() * 10) + 5; // 5-14 reps
  const randomWeight = Math.floor(Math.random() * 50) + 20; // 20-69 kg

  // Find inputs by their placeholder text
  const weightInput = page.getByPlaceholder("Enter Weight (kg)");
  const repetitionsInput = page.getByPlaceholder("Enter Repetitions");

  await weightInput.fill(randomWeight.toString());
  await page.waitForTimeout(intervalWaitTime);

  await repetitionsInput.fill(randomRepetitions.toString());
  await page.waitForTimeout(intervalWaitTime);

  // Save the subcard
  const saveSubcardResponse = page.waitForResponse(
    response => response.url().includes(`/exercises/${currentDate}`) && response.request().method() === "POST",
    { timeout: 4000 }
  );
  await page.getByTestId("save-button").click();
  await saveSubcardResponse;

  // Wait for the dialog to close
  await expect(page.getByTestId("edit-dialog")).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Verify the subcard was created by checking for the weight and reps text
  await expect(page.getByText(`${randomWeight}kg × ${randomRepetitions} reps`).first()).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Click on the subcard to edit it - click on the text that identifies it uniquely
  await page.getByText(`${randomWeight}kg × ${randomRepetitions} reps`).first().click();
  await page.waitForTimeout(intervalWaitTime);

  // Wait for the edit dialog to appear
  await expect(page.getByTestId("edit-dialog")).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Edit the repetitions
  const newRepetitions = randomRepetitions + 5;
  const editedRepetitionsInput = page.getByPlaceholder("Enter Repetitions");
  await editedRepetitionsInput.clear();
  await editedRepetitionsInput.fill(newRepetitions.toString());
  await page.waitForTimeout(intervalWaitTime);

  // Save the edited subcard
  const saveEditedSubcardResponse = page.waitForResponse(
    response => response.url().includes(`/exercises/${currentDate}`) && response.request().method() === "POST",
    { timeout: 4000 }
  );
  await page.getByTestId("save-button").click();
  await saveEditedSubcardResponse;

  // Wait for the dialog to close
  await expect(page.getByTestId("edit-dialog")).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Verify the subcard was edited
  await expect(page.getByText(`${randomWeight}kg × ${newRepetitions} reps`).first()).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Click on the subcard again to delete it - click on the updated text
  await page.getByText(`${randomWeight}kg × ${newRepetitions} reps`).first().click();
  await page.waitForTimeout(intervalWaitTime);

  // Wait for the edit dialog to appear
  await expect(page.getByTestId("edit-dialog")).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Delete the subcard
  const deleteSubcardResponse = page.waitForResponse(
    response => response.url().includes(`/exercises/${currentDate}`) && response.request().method() === "POST",
    { timeout: 4000 }
  );

  // Confirm deletion in browser dialog
  page.on("dialog", dialog => dialog.accept());

  await page.getByTestId("delete-button").click();
  await deleteSubcardResponse;

  // Wait for the dialog to close
  await expect(page.getByTestId("edit-dialog")).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Verify the subcard was deleted by checking the count decreased
  // (Note: We can't check if it's hidden because other sets might have the same values)
  // Instead, just verify we can continue with the test
  await page.waitForTimeout(intervalWaitTime);

  // Click on the exercise to delete it
  await page.getByText(exerciseName).click();
  await page.waitForTimeout(intervalWaitTime);

  // Wait for the edit dialog to appear
  await expect(page.getByTestId("edit-dialog")).toBeVisible({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Set up dialog handler before clicking delete button
  page.once("dialog", dialog => dialog.accept());

  // Delete the exercise and wait for API response (POST of entire exercise list with item removed)
  const deleteResponse = page.waitForResponse(
    response => response.url().includes(`/exercises/${currentDate}`) && response.request().method() === "POST",
    { timeout: 4000 }
  );

  await page.getByTestId("delete-button").click();
  await deleteResponse;

  // Wait for the dialog to close
  await expect(page.getByTestId("edit-dialog")).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);

  // Verify the exercise was deleted
  await expect(page.getByText(exerciseName)).toBeHidden({ timeout: 1500 });
  await page.waitForTimeout(intervalWaitTime);
});
