import { test, expect } from '@playwright/test';

test.describe('GauGyanWorld Critical Flows', () => {

    test('Homepage Load & Meta Check', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/GauGyan/i);
        // Check for critical SEO elements
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveCount(1);
    });

    test('Public Pages Availability', async ({ page }) => {
        const pages = ['/shop', '/courses', '/books', '/music'];
        for (const path of pages) {
            await page.goto(path);
            // Ensure no 500 error or blank page
            await expect(page.locator('body')).not.toBeEmpty();
            // Wait for some content to load
            await page.waitForLoadState('networkidle');
        }
    });

    test('Login Page Load', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByPlaceholder(/email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    test('LMS Course Listing', async ({ page }) => {
        await page.goto('/courses');
        // Expect at least one course card or "Courses" header
        await expect(page.locator('text=Courses')).toBeVisible();
    });

    // Placeholder for Auth test (Needs valid test credentials from env to fully execute)
    test.skip('Authenticated Learner Dashboard', async ({ page }) => {
        // TODO: Inject credentials via Env Vars
        await page.goto('/login');
        await page.fill('input[type="email"]', 'user@gaugyan.com');
        await page.fill('input[type="password"]', 'Password@123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/dashboard/);
    });
});
