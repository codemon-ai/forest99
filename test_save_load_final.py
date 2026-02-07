#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import time


def test_save_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("\n=== TEST 1: Main Menu (No Save Data) ===")
        page.goto("http://localhost:5173", timeout=60000)
        page.wait_for_load_state("load", timeout=60000)
        time.sleep(3)

        page.screenshot(path="/tmp/01_main_menu_no_save.png")
        print("✓ Screenshot: Main menu (no save data)")

        continue_button = page.locator('button:has-text("이어하기")')
        if continue_button.count() == 0:
            print("✓ PASS: '이어하기' button NOT visible (expected - no save data)")
        else:
            print("✗ FAIL: '이어하기' button visible (unexpected)")

        print("\n=== TEST 2: Start Game ===")
        start_button = page.locator('button:has-text("게임 시작")')
        if start_button.count() > 0:
            start_button.click()
            print("✓ Clicked '게임 시작'")
            time.sleep(4)
            page.screenshot(path="/tmp/02_game_started.png")
            print("✓ Screenshot: Game started")
        else:
            print("✗ FAIL: '게임 시작' button not found")
            browser.close()
            return

        print("\n=== TEST 3: Pause Menu (ESC) ===")
        page.press("body", "Escape")
        time.sleep(1)
        page.screenshot(path="/tmp/03_pause_menu.png")
        print("✓ Screenshot: Pause menu")

        pause_title = page.locator("text=일시정지")
        if pause_title.count() > 0:
            print("✓ PASS: Pause menu visible")
        else:
            print("✗ FAIL: Pause menu not visible")

        print("\n=== TEST 4: Save Game ===")
        save_button = page.locator('button:has-text("저장하기")')
        if save_button.count() > 0:
            save_button.click()
            print("✓ Clicked '저장하기'")
            time.sleep(1)
            page.screenshot(path="/tmp/04_save_complete.png")
            print("✓ Screenshot: After save button click")

            save_msg = page.locator("text=저장 완료")
            if save_msg.count() > 0:
                print("✓ PASS: '저장 완료!' message visible")
            else:
                print("⚠ WARNING: '저장 완료!' message not found (may appear briefly)")
        else:
            print("✗ FAIL: '저장하기' button not found")

        print("\n=== TEST 5: Refresh Page ===")
        page.reload()
        page.wait_for_load_state("load", timeout=60000)
        time.sleep(2)
        page.screenshot(path="/tmp/05_after_refresh.png")
        print("✓ Screenshot: After page refresh")

        print("\n=== TEST 6: Check Continue Button ===")
        continue_button = page.locator('button:has-text("이어하기")')
        if continue_button.count() > 0:
            print("✓ PASS: '이어하기' button NOW visible (save data exists)")
        else:
            print("✗ FAIL: '이어하기' button NOT visible (save data not persisted)")

        print("\n=== TEST 7: Load Game ===")
        if continue_button.count() > 0:
            continue_button.click()
            print("✓ Clicked '이어하기'")
            time.sleep(4)
            page.screenshot(path="/tmp/06_game_loaded.png")
            print("✓ Screenshot: Game loaded from save")

            hud_elements = page.locator('[class*="hud"], [class*="HUD"]')
            if hud_elements.count() > 0:
                print("✓ PASS: Game appears to be running (HUD visible)")
            else:
                print("⚠ WARNING: HUD elements not clearly identified")
        else:
            print("✗ FAIL: Cannot test load - '이어하기' button not available")

        print("\n=== TEST SUMMARY ===")
        print("Screenshots saved to /tmp/")

        browser.close()
        print("\n✓ Test completed")


if __name__ == "__main__":
    test_save_load()
