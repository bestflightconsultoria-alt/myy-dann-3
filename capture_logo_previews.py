import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 950, "height": 600})
        
        url = r"file:///C:/Users/Lucas/.gemini/antigravity/brain/7e314b13-60ab-4aae-9690-d9eacd03d06a/logo_previews_1c.html"
        await page.goto(url)
        await asyncio.sleep(1)

        img_path = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\logo_previews_1c.png"
        await page.screenshot(path=img_path)
        print(f"Screenshot salva em {img_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
