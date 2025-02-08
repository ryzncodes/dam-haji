import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('shows sign in form', async ({ page }) => {
    await page.goto('/login')
    
    // Check for form elements
    await expect(page.getByRole('heading', { name: 'Welcome to Dam Haji' })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in with email/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /play as guest/i })).toBeVisible()
  })

  test('handles guest sign in', async ({ page }) => {
    await page.goto('/login')
    
    // Click guest button
    const guestButton = page.getByRole('button', { name: /play as guest/i })
    await guestButton.click()

    // Should redirect to game page
    await expect(page).toHaveURL(/\/game/)
  })

  test('handles email sign in flow', async ({ page }) => {
    await page.goto('/login')
    
    // Fill and submit email form
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByRole('button', { name: /sign in with email/i }).click()

    // Should show success toast
    await expect(page.getByText(/check your email/i)).toBeVisible()
  })

  test('shows error page for invalid auth callback', async ({ page }) => {
    await page.goto('/auth/callback')
    
    // Should redirect to error page
    await expect(page).toHaveURL(/\/auth\/auth-error/)
    await expect(page.getByText(/authentication error/i)).toBeVisible()
  })
}) 