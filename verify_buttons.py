from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3001")

        # 1. Test Dashboard "Sync Data" button
        print("Testing Dashboard 'Sync Data' button...")
        page.fill('input[placeholder="Paste Google Sheet URL here"]', "https://docs.google.com/spreadsheets/d/12345")
        page.click('button:has-text("Sync Data")')
        print("Dashboard 'Sync Data' button clicked.")
        # We can't verify the backend call here, but we check for console errors or crashes.

        # 2. Navigate to Financials Page
        print("\nNavigating to Financials page...")
        # Correctly select the button, not a link
        financials_button = page.locator('button:has-text("FINANCIALS")')
        if financials_button.is_visible():
            financials_button.click()
            page.wait_for_selector('h3:has-text("Bulk Update Invoices")', timeout=10000)
            print("Successfully navigated to Financials page.")
        else:
            raise Exception("Financials button not found!")

        # 3. Test "Add Entry" button (opens modal)
        print("\nTesting 'Add Entry' button...")
        add_entry_button = page.locator('button:has-text("Add Entry")')
        add_entry_button.click()
        page.wait_for_selector('h2:has-text("Add New Expense")', timeout=5000)
        print("'Add New Expense' modal opened successfully.")
        # Take a screenshot to verify the modal
        page.screenshot(path="/home/jules/verification/add_expense_modal_retest.png")
        print("Screenshot 'add_expense_modal_retest.png' captured.")
        # Close the modal
        page.click('button:has-text("Cancel")')
        print("Modal closed.")

        # 4. Test "Export CSV" button
        print("\nTesting 'Export CSV' button...")
        export_button = page.locator('button:has-text("Export CSV")')
        # This will trigger a download. We can listen for the download event.
        with page.expect_download() as download_info:
            export_button.click()
        download = download_info.value
        print(f"Export CSV button clicked, download started for: {download.suggested_filename}")
        # We can't easily inspect the file content here, but confirming the download is a good step.
        download.save_as("/home/jules/verification/revenue_ledger.csv")
        print("File 'revenue_ledger.csv' saved.")


        # 5. Test "Import CSV" button (we can't easily test the file chooser, but we can check if it exists)
        print("\nTesting 'Import CSV' button presence...")
        import_input = page.locator('input[type="file"]')
        if import_input.is_visible():
             print("Import CSV input element is visible.")
        else:
            print("Warning: Import CSV input element is not visible.")

        print("\nButton functionality check script finished successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="/home/jules/verification/error_screenshot.png")
        print("Error screenshot captured as 'error_screenshot.png'.")

    finally:
        browser.close()

with sync_playwright() as p:
    run(p)
