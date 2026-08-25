import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Abrindo o catálogo de Genéticas da Adapta-Cann (43139fdabd.html)...")
        await page.goto("https://heyzine.com/flip-book/43139fdabd.html", wait_until="networkidle")
        await asyncio.sleep(4)

        print("2. Capturando páginas de genéticas da Adapta-Cann...")
        for p_num in range(1, 16):
            await page.screenshot(path=rf"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\adaptacann_genetics_p{p_num}.png")
            await page.keyboard.press("ArrowRight")
            await asyncio.sleep(2)

        text = await page.evaluate("document.body.innerText")
        print("--- CONTEÚDO DE GENÉTICAS DA ADAPTA-CANN ---")
        print(text[:4000])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
