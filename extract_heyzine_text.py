import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Abrindo o catálogo Heyzine da Adapta-Cann...")
        await page.goto("https://heyzine.com/flip-book/3d1e847d4a.html", wait_until="networkidle")
        await asyncio.sleep(4)

        # Extrai textos da página e das camadas PDF
        texts = []
        for p_num in range(1, 12):
            print(f"Lendo página {p_num}...")
            # Tira screenshot de cada página
            await page.screenshot(path=rf"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\adaptacann_page_{p_num}.png")
            
            # Clica no botão de próxima página se visível
            next_btn = page.locator("div.next, button.next, div[action='next']").first
            if await next_btn.is_visible():
                await next_btn.click()
                await asyncio.sleep(2)
            else:
                await page.keyboard.press("ArrowRight")
                await asyncio.sleep(2)

        doc_text = await page.evaluate("document.body.innerText")
        print("--- TEXTO COMPLETO DO FLIPBOOK HEYZINE ---")
        print(doc_text[:4000])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
